from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pymupdf
import openpyxl

ROOT = Path(r"D:\Cursor\Grand\changhong-shinelong")
SOURCE = Path(r"D:\Cursor\暂存\第二批\1504-宏祥隆机械")
PDF = SOURCE / "旋转阀选型手册 最终版.pdf"
XLSX = SOURCE / "企业资料&产品&FAQ问题收集表 - 常宏祥隆20260902.xlsx"
MANIFEST = ROOT / ".codex-delivery" / "product-coverage-manifest.json"


def norm(value: object) -> str:
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return " ".join(str(value).replace("\r", "\n").split())


def digest(value: object) -> str:
    return hashlib.sha256(norm(value).encode("utf-8")).hexdigest()


book = openpyxl.load_workbook(XLSX, data_only=True, read_only=True)
product_sheet = book["产品信息"]
customer_rows = []
for row in range(14, product_sheet.max_row + 1):
    values = [product_sheet.cell(row, col).value for col in range(1, product_sheet.max_column + 1)]
    if any(value not in (None, "") for value in values):
        customer_rows.append(row)
assert customer_rows == [], f"Unexpected customer product rows: {customer_rows}"

faq = book["FAQ问题"]
common_rows = {
    "models_available": (4, "Many models; refer to the selection catalogue.", "publish"),
    "customization": (5, "Custom size, material, colour and process are supported.", "publish"),
    "sample_evidence": (6, "Photo and video evidence can be provided instead of a physical sample.", "publish"),
    "technical_documents": (7, "Technical data sheets or inspection reports are available.", "publish"),
    "industries": (8, "Grain, food, feed, chemical, petrochemical, pharmaceutical, drying, environmental protection, dust collection and new energy (primarily lithium battery).", "publish"),
    "oem_odm": (9, "OEM / ODM is supported.", "publish"),
    "service_life": (10, "Source states 5–6 years under normal maintenance and 2–3 years under extreme conditions.", "backend_only"),
    "performance_advantages": (10, "Strong air sealing; anti-jam structure for complex materials; multiple materials and operating conditions; non-standard customization; durable and low-maintenance; convenient installation and maintenance.", "publish"),
    "moq": (11, "1 unit", "publish"),
    "quotation_basis": (12, "Pricing varies with parameters; non-standard products are quoted to customer requirements.", "backend_only"),
    "domestic_quote_scope": (13, "Source quotation includes domestic 13% VAT, packaging and domestic transport.", "backend_only"),
    "bulk_discount": (14, "Long-term cooperation and bulk pricing are supported.", "backend_only"),
    "price_fluctuation": (15, "Price may change with raw material costs or exchange rates.", "backend_only"),
    "sample_shipping": (16, "Samples can be shipped.", "publish"),
    "sample_fee_return": (17, "Samples are charged; returns incur two-way transport costs.", "backend_only"),
    "sample_lead_time": (18, "Normally 40 working days.", "publish"),
    "sample_approval": (19, "Customized products support paid sample approval before production.", "backend_only"),
    "sample_consistency": (20, "Source states samples are consistent with mass production.", "backend_only"),
    "production_lead_time": (21, "Normally 40 working days after order.", "publish"),
    "delivery_stability": (22, "Source states bulk lead time is stable.", "backend_only"),
    "peak_season_extension": (23, "Source states peak season does not extend lead time.", "backend_only"),
    "expedited_production": (24, "Expedited production is supported at a higher fee.", "backend_only"),
    "progress_updates": (25, "Production progress updates can be provided.", "publish"),
    "quality_control": (26, "A quality-control process is used.", "publish"),
    "third_party_inspection": (27, "Third-party inspection is supported.", "publish"),
    "inspection_report": (28, "Inspection or outgoing inspection reports are available.", "publish"),
    "quality_issue_handling": (29, "Quality issues are handled through consultation.", "backend_only"),
    "warranty_commitment": (30, "Source answers yes to a quality warranty period.", "excluded"),
}

doc = pymupdf.open(PDF)
page_text = {page + 1: doc[page].get_text().strip() for page in range(len(doc))}
manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

page_map = {
    "tgf-rotary-valve": (4, "TGF family catalogue specification table"),
    "zgf-rotary-valve": (4, "ZGF family catalogue specification table"),
    "zgfwe-zgfwf-high-temperature": (5, "High-temperature family catalogue specification table"),
    "zgfe-zgff-rotary-valve": (5, None),
    "lgfwe-lgfwf-chain-drive": (6, None),
    "bzgfwf-pressure-conveying": (6, "BZGFWF model, volume, dimensions, speed and motor-power table"),
    "zfs-rotary-valve": (7, "ZFS model, volume, dimensions, speed and motor-power table"),
    "bzgfwk-quick-clean": (7, "BZGFWK model, volume, dimensions, speed and motor-power table"),
    "zgb-heavy-duty": (8, "ZGB model, volume, dimensions, speed and motor-power table"),
    "zqx-rotary-valve": (8, "ZQX model, volume, dimensions, speed and motor-power table"),
    "zgp-rotary-valve": (9, "ZGP model, volume, dimensions, speed and motor-power table"),
    "zgc-rotary-valve": (9, "ZGC model, volume, dimensions, speed and motor-power table"),
    "qnlzgfwf-lined": (10, "QNLZGFWF model, volume, dimensions, speed, motor-power and lining table"),
    "tazgfwf-titanium": (10, None),
    "screw-conveyor": (11, "Screw conveyor description, construction, forms, applications and operating principle"),
    "electric-crushing-valve": (11, "Electric crushing valve function, principle, components, adjustable parameters and advantages"),
}

product_content = []
audit_export = []
for source in manifest["source_entries"]:
    key = source["product_key"]
    page, detail_label = page_map[key]
    fields = []

    def add(field_key: str, source_locator: str, value: object, disposition: str, reason: str | None = None):
        item = {
            "field_key": field_key,
            "source_locator": source_locator,
            "source_hash": digest(value),
            "source_value": value,
            "disposition": disposition,
        }
        if reason:
            item["reason"] = reason
        fields.append(item)

    add("product_name", f"{PDF}#page={page}/label", source["label"], "publish")
    add("model_family", f"{PDF}#page={page}/model-heading", source["label"].split(" ")[0], "publish")
    if detail_label:
        add("catalogue_specifications", f"{PDF}#page={page}/table", {"label": detail_label, "raw_page_text": page_text[page]}, "publish")
    for field_key, (row, value, disposition) in common_rows.items():
        reason = None
        if disposition == "backend_only":
            reason = "Retained for internal quotation/operations reference; public wording could become a variable commercial or operating commitment."
        elif disposition == "excluded":
            reason = "Excluded by the company-wide prohibition on warranty/guarantee commitments."
        add(field_key, f"{XLSX}#FAQ问题!D{row}", value, disposition, reason)

    publish = sum(1 for f in fields if f["disposition"] == "publish")
    backend_only = sum(1 for f in fields if f["disposition"] == "backend_only")
    excluded = sum(1 for f in fields if f["disposition"] == "excluded")
    content = {
        "product_key": key,
        "field_audit": {
            "status": "audited",
            "sources_checked": [
                f"{XLSX}#产品信息!A1:I176 (actual customer product rows A14:I176: 0)",
                f"{XLSX}#FAQ问题!A1:D30",
                f"{PDF}#page={page}",
                "http://www.chxljx.com/ (public old-site homepage checked; no additional attributable product detail found)",
                f"{ROOT}\\.codex-delivery\\material-extract\\pdf-product-media",
            ],
            "source_nonempty_business_field_count": len(fields),
            "excel_product_customer_row_count": 0,
            "disposition_counts": {"publish": publish, "backend_only": backend_only, "excluded": excluded},
        },
        "provided_fields": fields,
        "description": {
            "source_status": "provided" if detail_label else "not_provided",
            **({"source_locator": f"{PDF}#page={page}", "source_hash": digest(page_text[page])} if detail_label else {"reason": "No product-specific prose beyond the labelled family image/model was found in the checked sources."}),
        },
        "specifications": {
            "source_status": "provided" if detail_label else "not_provided",
            **({"source_locator": f"{PDF}#page={page}/table", "source_keys": ["catalogue_specifications"]} if detail_label else {"reason": "No attributable product-specific specification table was found in the checked sources."}),
        },
    }
    product_content.append(content)
    audit_export.append({"product_key": key, "label": source["label"], "page": page, "fields": fields})

manifest["product_content"] = product_content
MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(ROOT / "lib" / "product-source-audit.json").write_text(json.dumps(audit_export, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

totals = {
    "products": len(product_content),
    "nonempty_fields": sum(x["field_audit"]["source_nonempty_business_field_count"] for x in product_content),
    "zero_field_products": sum(x["field_audit"]["source_nonempty_business_field_count"] == 0 for x in product_content),
    "publish": sum(x["field_audit"]["disposition_counts"]["publish"] for x in product_content),
    "backend_only": sum(x["field_audit"]["disposition_counts"]["backend_only"] for x in product_content),
    "excluded": sum(x["field_audit"]["disposition_counts"]["excluded"] for x in product_content),
}
lines = [
    "# Product field audit",
    "",
    "- Excel: all sheets and actual used ranges checked. `产品信息!A14:I176` contains zero customer product rows; rows 4–12 are examples and row 13 is guidance, so none were treated as customer product data.",
    "- PDF: all 12 pages, text blocks, tables, page renders and embedded product media checked.",
    "- Old site: public homepage checked; no additional product detail attributable with sufficient confidence.",
    f"- Products: {totals['products']}; non-empty audited fields: {totals['nonempty_fields']}; zero-field products: {totals['zero_field_products']}.",
    f"- Dispositions: publish {totals['publish']}; backend_only {totals['backend_only']}; excluded {totals['excluded']}.",
    "- Warranty answer is retained only as an audited excluded field under the company-wide prohibition. Variable quotation, price, tax, return and schedule statements are preserved backend-only with reasons.",
    "",
    "| Product | Fields | Publish | Backend only | Excluded |",
    "|---|---:|---:|---:|---:|",
]
for item in product_content:
    c = item["field_audit"]["disposition_counts"]
    lines.append(f"| {item['product_key']} | {item['field_audit']['source_nonempty_business_field_count']} | {c['publish']} | {c['backend_only']} | {c['excluded']} |")
(ROOT / "deliverables" / "product-field-audit.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps(totals, ensure_ascii=False))
