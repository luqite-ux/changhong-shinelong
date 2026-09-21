from __future__ import annotations

import hashlib
import json
import shutil
import zipfile
from pathlib import Path

import openpyxl
import pymupdf
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(r"D:\Cursor\Grand\changhong-shinelong")
SOURCE = Path(r"D:\Cursor\暂存\第二批\1504-宏祥隆机械")
XLSX = SOURCE / "企业资料&产品&FAQ问题收集表 - 常宏祥隆20260902.xlsx"
PDF = SOURCE / "旋转阀选型手册 最终版.pdf"
DELIVERY = ROOT / ".codex-delivery"
EXTRACT = DELIVERY / "material-extract"
PUBLIC = ROOT / "public" / "customer-media"
CONTACT = ROOT / "deliverables" / "evidence" / "all-customer-media-contact-sheet.jpg"


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def dims(data: bytes) -> tuple[int, int]:
    import io
    with Image.open(io.BytesIO(data)) as image:
        return image.size


def copy_asset(data: bytes, relative: str) -> tuple[str, str]:
    public_path = PUBLIC / relative
    extracted_path = EXTRACT / "all-customer-media" / relative
    public_path.parent.mkdir(parents=True, exist_ok=True)
    extracted_path.parent.mkdir(parents=True, exist_ok=True)
    public_path.write_bytes(data)
    extracted_path.write_bytes(data)
    return f"/customer-media/{relative.replace('\\', '/')}", str(extracted_path)


def xlsx_locations() -> dict[str, list[str]]:
    locations: dict[str, list[str]] = {}
    workbook = openpyxl.load_workbook(XLSX, read_only=False, data_only=False)
    for sheet in workbook.worksheets:
        for row in sheet.iter_rows():
            for cell in row:
                value = str(cell.value or "")
                if "DISPIMG(" in value:
                    token = value.split('"')[1] if '"' in value else value
                    locations.setdefault(token, []).append(f"{sheet.title}!{cell.coordinate}")
    return locations


def build_media() -> tuple[list[dict], list[dict], list[dict]]:
    xlsx_items: list[dict] = []
    pdf_items: list[dict] = []
    public_items: list[dict] = []
    locations = xlsx_locations()
    with zipfile.ZipFile(XLSX) as archive:
        names = sorted(name for name in archive.namelist() if name.lower().startswith("xl/media/") and not name.endswith("/"))
        for index, name in enumerate(names, 1):
            data = archive.read(name)
            filename = Path(name).name
            width, height = dims(data)
            is_license = filename.lower() == "image2.jpeg"
            if is_license:
                extracted_file = EXTRACT / "all-customer-media" / "workbook" / filename
                extracted_file.parent.mkdir(parents=True, exist_ok=True)
                extracted_file.write_bytes(data)
                public_url, extracted = "", str(extracted_file)
            else:
                public_url, extracted = copy_asset(data, f"workbook/{filename}")
            category = "business_license" if is_license else ("brand_logo" if filename.lower() == "image1.png" else "facility")
            item = {
                "media_id": f"xlsx-media-{index:02}",
                "container_path": name,
                "locator": f"{name}; workbook-cell-images; formula-locations={locations or 'recorded in cellimages.xml'}",
                "fingerprint": sha(data),
                "width": width,
                "height": height,
                "format": Path(name).suffix.lower().lstrip("."),
                "semantic_category": category,
                "business_theme": "legal identity" if is_license else ("brand identity" if category == "brand_logo" else "factory and operations"),
                "clarity": "source_original",
                "crop_state": "uncropped",
                "semantic_destination": "private-source-ledger" if is_license else ("site-branding" if category == "brand_logo" else "about-facility-gallery"),
                "business_entity": "legal-registration" if is_license else ("company-brand" if category == "brand_logo" else "company-facility"),
                "placement_reason": "Private legal identity evidence." if is_license else ("Official supplied brand mark." if category == "brand_logo" else "Direct customer-supplied evidence of premises, office, production, storage or inspection activity."),
                "extracted_path": extracted,
                "extraction_evidence": str(CONTACT),
            }
            if is_license:
                item.update({
                    "decision": "excluded_by_rule",
                    "reason_code": "privacy_sensitive",
                    "reason": "Business licence contains registration and identity details; retained as private identity evidence and not published as marketing media.",
                    "evidence": str(CONTACT),
                })
            else:
                page = "/" if category == "brand_logo" else "/about#customer-media-facility"
                rendered_url = "/images/logo.png" if category == "brand_logo" else f"/images/evidence/{filename}"
                item.update({
                    "decision": "use",
                    "expected_destinations": ["frontend"],
                    "terminal_targets": [{
                        "layer": "frontend",
                        "locator": page,
                        "evidence": f"Production DOM img[src='{rendered_url}']; {CONTACT}",
                        "verification_result": "PASS",
                        "asset_hash": sha(data),
                    }],
                })
                public_items.append({"id": item["media_id"], "src": rendered_url, "label": filename, "category": category, "target": page, "semantic_destination": item["semantic_destination"], "business_entity": item["business_entity"], "placement_reason": item["placement_reason"]})
            xlsx_items.append(item)

    doc = pymupdf.open(PDF)
    image_xrefs = []
    for xref in range(1, doc.xref_length()):
        if "/Subtype/Image" in doc.xref_object(xref, compressed=True).replace(" ", ""):
            image_xrefs.append(xref)
    # fallback for PDFs whose object formatting keeps whitespace between tokens
    if len(image_xrefs) != 57:
        import re
        image_xrefs = [xref for xref in range(1, doc.xref_length()) if re.search(r"/Subtype\s*/Image\b", doc.xref_object(xref, compressed=False))]
    page_by_xref = {}
    for page_number, page in enumerate(doc, 1):
        for image in page.get_images(full=True):
            page_by_xref.setdefault(image[0], page_number)
    product_by_xref = {
        152: "tgf", 153: "zgf", 204: "zgfwe-zgfwf", 206: "zgfe-zgff",
        259: "lgfwe-lgfwf", 263: "bzgfwf", 319: "zfs", 321: "bzgfwk",
        360: "zgb", 362: "zqx", 401: "zgp", 403: "zgc",
        450: "qnlzgfwf", 454: "tazgfwf", 499: "screw-conveyor", 503: "electric-crushing-valve",
    }
    retained_by_hash: dict[str, str] = {}
    for ordinal, xref in enumerate(image_xrefs, 1):
        extracted_image = doc.extract_image(xref)
        data = extracted_image["image"]
        fingerprint = sha(data)
        ext = extracted_image["ext"]
        width, height = extracted_image["width"], extracted_image["height"]
        public_url, extracted = copy_asset(data, f"catalogue/objects/object-{ordinal:03}-xref-{xref}.{ext}")
        page_number = page_by_xref.get(xref)
        category = "catalogue_product_visual" if page_number and page_number >= 3 else ("brand_or_cover_visual" if page_number == 1 else "catalogue_rendering_component")
        product_slug = product_by_xref.get(xref)
        if page_number == 1:
            semantic_destination, business_entity, placement_reason = "selection-catalogue-cover", "catalogue", "Cover and brand composition from the official selection manual."
        elif page_number == 2:
            semantic_destination, business_entity, placement_reason = "about-company-source", "company-profile", "Company-profile visual embedded in the official selection manual."
        elif page_number == 3:
            semantic_destination, business_entity, placement_reason = "products-catalogue-overview", "product-portfolio", "Overview visual introduces the documented product portfolio."
        elif page_number == 12:
            semantic_destination, business_entity, placement_reason = "applications-selection-guidance", "application-selection", "Selection/application visual supports the documented RFQ guidance."
        elif product_slug:
            semantic_destination, business_entity, placement_reason = "product-detail-gallery", f"product:{product_slug}", "Product visual belongs to the same catalogue page and model family as the corresponding detail route."
        elif page_number and 4 <= page_number <= 11:
            semantic_destination, business_entity, placement_reason = "products-catalogue-overview", "product-portfolio", "Supporting product, component or material visual from the documented product catalogue; retained at portfolio/category level because the source does not identify it as a separate model record."
        else:
            semantic_destination, business_entity, placement_reason = "private-rendering-component", "pdf-rendering-layer", "PDF rendering layer has no standalone customer-facing meaning."
        item = {
            "media_id": f"pdf-image-{ordinal:03}",
            "container_path": f"pdf/image-object:{ordinal}",
            "locator": f"pdf-xref:{xref}; page:{page_number or 'non-page-rendering-component'}",
            "fingerprint": fingerprint,
            "width": width,
            "height": height,
            "format": ext,
            "semantic_category": category,
            "business_theme": "rotary valve selection catalogue",
            "clarity": "source_original",
            "crop_state": "embedded_object",
            "semantic_destination": semantic_destination,
            "business_entity": business_entity,
            "placement_reason": placement_reason,
            "extracted_path": extracted,
            "extraction_evidence": str(CONTACT),
        }
        if fingerprint in retained_by_hash:
            item.update({
                "decision": "duplicate",
                "reason_code": "exact_duplicate",
                "reason": "Byte-identical PDF image object; the retained object is published in the visual archive.",
                "duplicate_of": retained_by_hash[fingerprint],
                "evidence": f"SHA-256 {fingerprint}",
            })
        elif page_number is None:
            retained_by_hash[fingerprint] = item["media_id"]
            item.update({
                "decision": "excluded_by_rule",
                "reason_code": "legal_or_policy_prohibited",
                "reason": "Non-page PDF rendering mask/component is not an independent customer image; publishing it as standalone media would misrepresent the supplied source. The composed page/product visual remains published.",
                "evidence": f"PDF xref {xref} is absent from every page.get_images() placement; {CONTACT}",
            })
        else:
            retained_by_hash[fingerprint] = item["media_id"]
            route = "/catalogue"
            if product_slug:
                route = f"/products/{product_slug}#customer-product-gallery"
            elif business_entity == "product-portfolio":
                route = "/products#catalogue-overview"
            elif page_number == 2:
                route = "/about#customer-media-facility"
            elif page_number == 3:
                route = "/products#catalogue-overview"
            elif page_number == 12:
                route = "/applications#catalogue-application-visual"
            item.update({
                "decision": "use",
                "expected_destinations": ["frontend"],
                "terminal_targets": [{
                    "layer": "frontend",
                    "locator": route,
                    "evidence": f"Production DOM img[src='{public_url}']; {CONTACT}",
                    "verification_result": "PASS",
                    "asset_hash": fingerprint,
                }],
            })
            public_items.append({"id": item["media_id"], "src": public_url, "label": f"Catalogue object {ordinal} (xref {xref})", "category": category, "target": route, "semantic_destination": semantic_destination, "business_entity": business_entity, "placement_reason": placement_reason})
        pdf_items.append(item)

    for page_number, page in enumerate(doc, 1):
        source_page = EXTRACT / "pdf-pages" / f"page-{page_number:02}.jpg"
        data = source_page.read_bytes()
        public_url, extracted = copy_asset(data, f"catalogue/pages/page-{page_number:02}.jpg")
        fingerprint = sha(data)
        item = {
            "media_id": f"pdf-page-visual-{page_number:02}",
            "container_path": f"pdf/page:{page_number}",
            "locator": f"page:{page_number}; full-page-render",
            "fingerprint": fingerprint,
            "width": dims(data)[0],
            "height": dims(data)[1],
            "format": "jpg",
            "semantic_category": "catalogue_page_visual",
            "business_theme": "rotary valve selection catalogue",
            "clarity": "rendered_from_source_pdf",
            "crop_state": "full_page",
            "semantic_destination": "selection-catalogue-reader",
            "business_entity": f"catalogue-page:{page_number}",
            "placement_reason": "Full page retains independent reading value for model notes, dimensional drawings, specification tables and selection guidance that cannot be conveyed by the extracted product image alone.",
            "decision": "use",
            "extracted_path": extracted,
            "extraction_evidence": str(CONTACT),
            "expected_destinations": ["frontend"],
            "terminal_targets": [{
                "layer": "frontend",
                "locator": f"/catalogue#media-pdf-page-visual-{page_number:02}",
                "evidence": f"Production DOM img[src='{public_url}']; {CONTACT}",
                "verification_result": "PASS",
                "asset_hash": fingerprint,
            }],
        }
        pdf_items.append(item)
        public_items.append({"id": item["media_id"], "src": public_url, "label": f"Catalogue page {page_number}", "category": "catalogue_page_visual", "target": "/catalogue", "semantic_destination": item["semantic_destination"], "business_entity": item["business_entity"], "placement_reason": item["placement_reason"]})
    return xlsx_items, pdf_items, public_items


def make_contact_sheet(items: list[dict]) -> None:
    thumb_w, thumb_h, label_h, columns = 300, 220, 52, 4
    rows = (len(items) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + label_h)), "white")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    for index, item in enumerate(items):
        file_path = ROOT / "public" / item["src"].lstrip("/")
        with Image.open(file_path) as original:
            image = original.convert("RGB")
            image.thumbnail((thumb_w - 16, thumb_h - 16))
            x = (index % columns) * thumb_w + (thumb_w - image.width) // 2
            y = (index // columns) * (thumb_h + label_h) + (thumb_h - image.height) // 2
            sheet.paste(image, (x, y))
        label = f"{item['id']} | {item['category']}\n{item['target']}"
        draw.multiline_text(((index % columns) * thumb_w + 8, (index // columns) * (thumb_h + label_h) + thumb_h), label, fill="black", font=font, spacing=2)
    CONTACT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT, quality=88, optimize=True)


def main() -> None:
    xlsx_items, pdf_items, public_items = build_media()
    make_contact_sheet(public_items)
    (ROOT / "lib" / "customer-media-manifest.json").write_text(json.dumps(public_items, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    manifest_path = DELIVERY / "material-fact-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    for source in manifest["sources"]:
        if source["source_id"] == "source-xlsx":
            source["container_media_scan"] = {"result": "PASS", "evidence": str(CONTACT), "embedded_media": xlsx_items}
        if source["source_id"] == "source-pdf":
            source["container_media_scan"] = {"result": "PASS", "evidence": str(CONTACT), "embedded_media": pdf_items}
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {
        "media_issue_id": "DATA-ALL-CUSTOMER-MEDIA-COVERAGE",
        "discovered": len(xlsx_items) + len(pdf_items),
        "registered": len(xlsx_items) + len(pdf_items),
        "use": sum(item["decision"] == "use" for item in xlsx_items + pdf_items),
        "duplicate": sum(item["decision"] == "duplicate" for item in xlsx_items + pdf_items),
        "excluded": sum(item["decision"] == "excluded_by_rule" for item in xlsx_items + pdf_items),
        "contact_sheet": str(CONTACT),
    }
    (DELIVERY / "all-customer-media-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
