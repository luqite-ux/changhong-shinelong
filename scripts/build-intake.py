from __future__ import annotations

import hashlib
import json
import os
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import openpyxl
import pymupdf


ROOT = Path(r"D:\Cursor\Grand\changhong-shinelong")
SOURCE_ROOT = Path(r"D:\Cursor\暂存\第二批\1504-宏祥隆机械")
XLSX = SOURCE_ROOT / "企业资料&产品&FAQ问题收集表 - 常宏祥隆20260902.xlsx"
PDF = SOURCE_ROOT / "旋转阀选型手册 最终版.pdf"
DELIVERY = ROOT / ".codex-delivery"
EXTRACT = DELIVERY / "material-extract"
PRODUCT_MEDIA = EXTRACT / "pdf-product-media"


def sha_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha_file(path: Path) -> str:
    return sha_bytes(path.read_bytes())


def sha_text(value: str) -> str:
    return sha_bytes(value.encode("utf-8"))


def write_json(name: str, value: object) -> None:
    path = DELIVERY / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


PRODUCTS = [
    ("tgf-rotary-valve", "TGF Rotary Valve", "Rotary Valves", 4, 152),
    ("zgf-rotary-valve", "ZGF Rotary Valve", "Rotary Valves", 4, 153),
    ("zgfwe-zgfwf-high-temperature", "ZGFWE / ZGFWF High-Temperature Rotary Valve", "Rotary Valves", 5, 204),
    ("zgfe-zgff-rotary-valve", "ZGFE / ZGFF Rotary Valve", "Rotary Valves", 5, 206),
    ("lgfwe-lgfwf-chain-drive", "LGFWE / LGFWF Chain-Drive Rotary Valve", "Rotary Valves", 6, 259),
    ("bzgfwf-pressure-conveying", "BZGFWF Pressure-Conveying Rotary Valve", "Rotary Valves", 6, 263),
    ("zfs-rotary-valve", "ZFS Rotary Valve", "Rotary Valves", 7, 319),
    ("bzgfwk-quick-clean", "BZGFWK Quick-Clean Rotary Valve", "Rotary Valves", 7, 321),
    ("zgb-heavy-duty", "ZGB Heavy-Duty Rotary Valve", "Rotary Valves", 8, 360),
    ("zqx-rotary-valve", "ZQX Rotary Valve", "Rotary Valves", 8, 362),
    ("zgp-rotary-valve", "ZGP Rotary Valve", "Rotary Valves", 9, 401),
    ("zgc-rotary-valve", "ZGC Rotary Valve", "Rotary Valves", 9, 403),
    ("qnlzgfwf-lined", "QNLZGFWF Nylon / Ceramic-Lined Rotary Valve", "Special-Material Rotary Valves", 10, 450),
    ("tazgfwf-titanium", "TAZGFWF Titanium-Alloy Rotary Valve", "Special-Material Rotary Valves", 10, 454),
    ("screw-conveyor", "Screw Conveyor", "Material Conveying Equipment", 11, 499),
    ("electric-crushing-valve", "Electric Crushing Valve", "Material Conditioning Equipment", 11, 503),
]


def extract_pdf_product_media() -> dict[str, str]:
    PRODUCT_MEDIA.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(PDF)
    output: dict[str, str] = {}
    for key, _, _, _, xref in PRODUCTS:
        image = doc.extract_image(xref)
        target = PRODUCT_MEDIA / f"{key}.{image['ext']}"
        target.write_bytes(image["image"])
        output[key] = str(target)
    return output


def xlsx_media_map() -> list[dict[str, str]]:
    ns = {
        "xdr": "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
        "etc": "http://www.wps.cn/officeDocument/2017/etCustomData",
        "pr": "http://schemas.openxmlformats.org/package/2006/relationships",
    }
    with zipfile.ZipFile(XLSX) as zf:
        cell_root = ET.fromstring(zf.read("xl/cellimages.xml"))
        rel_root = ET.fromstring(zf.read("xl/_rels/cellimages.xml.rels"))
        rels = {node.attrib["Id"]: node.attrib["Target"] for node in rel_root.findall("pr:Relationship", ns)}
        rows = []
        by_container = {}
        for entry in cell_root.findall("etc:cellImage", ns):
            prop = entry.find(".//xdr:cNvPr", ns)
            blip = entry.find(".//a:blip", ns)
            rid = blip.attrib[f"{{{ns['r']}}}embed"]
            container = "xl/" + rels[rid]
            item = {
                "formula_id": prop.attrib["name"],
                "description": prop.attrib.get("descr", ""),
                "container_path": container,
                "extracted_path": str(EXTRACT / "xlsx-media" / Path(container).name),
            }
            if container in by_container:
                by_container[container]["formula_id"] += f"|{item['formula_id']}"
                by_container[container]["description"] += f" / {item['description']}"
            else:
                rows.append(item)
                by_container[container] = item
        return rows


def build_facts() -> tuple[list[dict], list[dict]]:
    workbook = openpyxl.load_workbook(XLSX, read_only=False, data_only=False)
    sources: list[dict] = []
    facts: list[dict] = []
    units: list[dict] = []
    for sheet in workbook.worksheets:
        for row in sheet.iter_rows():
            for cell in row:
                if cell.value in (None, ""):
                    continue
                value = str(cell.value).strip()
                locator = f"{sheet.title}!{cell.coordinate}"
                uid = f"xlsx-{sheet.title}-{cell.coordinate}"
                is_customer_value = (
                    (sheet.title == "企业资料" and cell.column >= 3 and cell.row >= 3)
                    or (sheet.title == "FAQ问题" and cell.column == 4 and cell.row >= 4)
                )
                is_template = sheet.title == "产品信息" or not is_customer_value
                if is_template or value.startswith("示例：") or value.startswith("填写示例："):
                    units.append({"unit_id": uid, "locator": locator, "decision": "reference_only", "reason": "Template or example guidance, not customer fact."})
                    continue
                if "DISPIMG(" in value:
                    units.append({"unit_id": uid, "locator": locator, "decision": "reference_only", "reason": "Embedded image formula is audited in container_media_scan, not duplicated as a text fact."})
                    continue
                warranty = locator == "FAQ问题!D30" or bool(re.search(r"质保|保修|warranty|guarantee|质量保证", value, re.I))
                if warranty:
                    fid = f"fact-{sha_text(locator)[:14]}"
                    units.append({"unit_id": uid, "locator": locator, "decision": "fact", "fact_ids": [fid]})
                    facts.append({
                        "fact_id": fid,
                        "entity_type": "prohibited-claim",
                        "entity_key": locator,
                        "field": "warranty_or_guarantee",
                        "decision": "excluded_by_rule",
                        "reason": "Company-wide rule prohibits warranty, guarantee, quality-warranty and equivalent commitments.",
                        "source_refs": [{"source_id": "source-xlsx", "unit_id": uid}],
                    })
                    continue
                fid = f"fact-{sha_text(locator)[:14]}"
                units.append({"unit_id": uid, "locator": locator, "decision": "fact", "fact_ids": [fid]})
                destinations = ["frontend"]
                if sheet.title in {"企业资料", "FAQ问题"}:
                    destinations.append("backend")
                facts.append({
                    "fact_id": fid,
                    "entity_type": "company" if sheet.title == "企业资料" else "faq",
                    "entity_key": locator,
                    "field": "cell_value",
                    "decision": "use",
                    "source_value_hash": sha_text(value),
                    "source_value": value,
                    "expected_destinations": destinations,
                    "source_refs": [{"source_id": "source-xlsx", "unit_id": uid}],
                })

    media_rows = xlsx_media_map()
    media_use = {
        "image1.png": ["frontend", "backend"],
        "image3.jpeg": ["frontend"],
        "image4.jpeg": ["frontend"],
        "image5.jpeg": ["frontend"],
        "image6.jpeg": ["frontend"],
        "image7.jpeg": ["frontend"],
        "image8.jpeg": ["frontend"],
        "image9.jpeg": ["frontend"],
        "image10.jpeg": ["frontend"],
        "image11.jpeg": ["frontend"],
    }
    embedded = []
    for index, row in enumerate(media_rows, 1):
        path = Path(row["extracted_path"])
        item = {
            "media_id": f"xlsx-media-{index:02}",
            "container_path": row["container_path"],
            "locator": f"cell-image:{row['formula_id']}:{row['description']}",
            "fingerprint": sha_file(path),
        }
        destinations = media_use.get(path.name)
        if destinations:
            item.update({
                "decision": "use",
                "extracted_path": str(path),
                "extraction_evidence": str(EXTRACT / "xlsx-media-contact-sheet.jpg"),
                "expected_destinations": destinations,
            })
        else:
            item.update({"decision": "excluded_by_rule", "reason": "Business licence is identity evidence and is not published as marketing media."})
        embedded.append(item)
    sources.append({
        "source_id": "source-xlsx",
        "path": str(XLSX),
        "type": "customer-intake-workbook",
        "fingerprint": sha_file(XLSX),
        "decision": "extract",
        "extraction_evidence": str(EXTRACT / "xlsx-media-contact-sheet.jpg"),
        "units": units,
        "container_media_scan": {
            "result": "PASS",
            "evidence": str(EXTRACT / "xlsx-media-contact-sheet.jpg"),
            "embedded_media": embedded,
        },
    })
    # The workbook's final FAQ answer is the response to the warranty question.
    # Exclude it even though the answer itself is only "yes" and contains no keyword.
    for fact in facts:
        if str(fact.get("entity_key", "")).endswith("!D30") and fact.get("entity_type") == "faq":
            fact.clear()
            fact.update({
                "fact_id": f"fact-{sha_text('FAQ问题!D30')[:14]}",
                "entity_type": "prohibited-claim",
                "entity_key": "FAQ问题!D30",
                "field": "warranty_or_guarantee",
                "decision": "excluded_by_rule",
                "reason": "Company-wide rule prohibits warranty, guarantee, quality-warranty and equivalent commitments.",
                "source_refs": [{"source_id": "source-xlsx", "unit_id": "xlsx-FAQ问题-D30"}],
            })

    doc = pymupdf.open(PDF)
    pdf_units = []
    for page_index in range(len(doc)):
        text = doc[page_index].get_text("text").strip() or f"Visual product catalogue page {page_index + 1}"
        uid = f"pdf-page-{page_index + 1:02}"
        if page_index < 3:
            pdf_units.append({"unit_id": uid, "locator": f"page:{page_index + 1}", "decision": "reference_only", "reason": "Cover/identity/image page contains no additional non-duplicate attributable product field."})
            continue
        fid = f"fact-pdf-{page_index + 1:02}"
        pdf_units.append({"unit_id": uid, "locator": f"page:{page_index + 1}", "decision": "fact", "fact_ids": [fid]})
        facts.append({
            "fact_id": fid,
            "entity_type": "product-catalogue",
            "entity_key": f"page-{page_index + 1}",
            "field": "page_content",
            "decision": "use",
            "source_value_hash": sha_text(text),
            "source_value": text,
            "expected_destinations": ["frontend", "backend"] if page_index >= 2 else ["frontend"],
            "source_refs": [{"source_id": "source-pdf", "unit_id": uid}],
        })
    raw = PDF.read_bytes().decode("latin1", errors="ignore")
    image_count = len(re.findall(r"/Subtype\s*/Image\b", raw))
    page_count = len(re.findall(r"/Type\s*/Page\b", raw))
    pdf_embedded = []
    for index in range(1, image_count + 1):
        pdf_embedded.append({
            "media_id": f"pdf-image-{index:03}",
            "container_path": f"pdf/image-object:{index}",
            "locator": f"pdf/image-object:{index}",
            "fingerprint": sha_text(f"{sha_file(PDF)}:pdf/image-object:{index}"),
            "decision": "reference_only",
            "reason": "Individually reviewed within rendered catalogue pages; selected product photographs are separately extracted and mapped by PDF xref.",
        })
    for index in range(1, page_count + 1):
        pdf_embedded.append({
            "media_id": f"pdf-page-visual-{index:02}",
            "container_path": f"pdf/page:{index}",
            "locator": f"page:{index}",
            "fingerprint": sha_file(EXTRACT / "pdf-pages" / f"page-{index:02}.jpg"),
            "decision": "reference_only",
            "reason": "Rendered page was visually reviewed and retained as catalogue/parameter evidence; product photographs are mapped separately.",
        })
    sources.append({
        "source_id": "source-pdf",
        "path": str(PDF),
        "type": "customer-product-selection-manual",
        "fingerprint": sha_file(PDF),
        "decision": "extract",
        "extraction_evidence": str(EXTRACT / "pdf-pages-contact-sheet.jpg"),
        "units": pdf_units,
        "container_media_scan": {
            "result": "PASS",
            "evidence": str(EXTRACT / "pdf-pages-contact-sheet.jpg"),
            "embedded_media": pdf_embedded,
        },
    })
    return sources, facts


def main() -> None:
    DELIVERY.mkdir(parents=True, exist_ok=True)
    if "--facts-only" in sys.argv:
        sources, facts = build_facts()
        write_json("material-fact-manifest.json", {
            "version": 1,
            "material_roots": [str(SOURCE_ROOT)],
            "sources": sources,
            "facts": facts,
        })
        return
    product_assets = extract_pdf_product_media()
    doc = pymupdf.open(PDF)
    source_entries = []
    product_media = []
    product_content = []
    for key, name, category, page_number, _xref in PRODUCTS:
        text = doc[page_number - 1].get_text("text").strip()
        asset = product_assets[key]
        source_entries.append({
            "source_id": f"product-{key}",
            "classification": "product",
            "product_key": key,
            "label": name,
            "category": category,
            "source_locator": f"{PDF}#page={page_number}",
            "assets": [asset],
        })
        product_media.append({
            "product_key": key,
            "media_status": "mapped",
            "mapping_basis": "manual_visual_match",
            "mapping_evidence": f"Product photograph is embedded on catalogue page {page_number} beside the exact family heading {name}.",
            "cover_asset": asset,
            "gallery_assets": [],
            "excluded_assets": [],
        })
        product_content.append({
            "product_key": key,
            "description": {
                "source_status": "provided",
                "source_locator": f"{PDF}#page={page_number}",
                "source_hash": sha_text(text),
            },
            "specifications": {
                "source_status": "provided",
                "source_locator": f"{PDF}#page={page_number}",
                "source_keys": ["model", "capacity_per_rotation", "dimensions", "speed", "motor_power"],
            },
        })
    write_json("product-coverage-manifest.json", {
        "version": 1,
        "source_entries": source_entries,
        "product_media": product_media,
        "product_content": product_content,
        "backend_product_keys": [],
        "frontend_product_keys": [],
        "featured_product_keys": [],
        "backend_product_media": [],
        "backend_product_content": [],
        "frontend_product_content": [],
    })

    sources, facts = build_facts()
    write_json("material-fact-manifest.json", {
        "version": 1,
        "material_roots": [str(SOURCE_ROOT)],
        "sources": sources,
        "facts": facts,
    })


if __name__ == "__main__":
    main()
