import os
import shutil
import hashlib
import json
import mimetypes
from pathlib import Path
from PIL import Image

WORKSPACE = Path(r"d:\Software\SAIF PORTFOLIO")
SOURCE_DIR = Path(r"C:\Users\DELL\Downloads\AUTOMATION Projects-20261106T080539Z-1-001")
DOWNLOADS_DIR = Path(r"C:\Users\DELL\Downloads")

# 1. Directories to create
DIRS = [
    WORKSPACE / "public" / "assets" / "portrait",
    WORKSPACE / "public" / "assets" / "automations" / "01-adaptive-hitl",
    WORKSPACE / "public" / "assets" / "automations" / "02-content-publishing",
    WORKSPACE / "public" / "assets" / "automations" / "03-lead-generation",
    WORKSPACE / "public" / "assets" / "automations" / "04-bulk-email",
    WORKSPACE / "public" / "assets" / "automations" / "05-enterprise-automation",
    WORKSPACE / "public" / "assets" / "automations" / "06-lead-qualification",
    WORKSPACE / "public" / "assets" / "websites" / "sumeri",
    WORKSPACE / "public" / "assets" / "websites" / "time-and-tide",
    WORKSPACE / "public" / "assets" / "websites" / "neocut-digital",
    WORKSPACE / "public" / "assets" / "apps" / "si-enterprise",
    WORKSPACE / "portfolio-content" / "automation-documentation",
    WORKSPACE / "portfolio-content" / "workflow-screenshots-review",
    WORKSPACE / "portfolio-content" / "additional-screenshots",
    WORKSPACE / "portfolio-content" / "inventory",
    WORKSPACE / "portfolio-content" / "reference",
]

# Additional specific subdirectories for organized structure
PROJECT_SUBDIRS = [
    "01-adaptive-hitl",
    "02-content-publishing",
    "03-lead-generation",
    "04-bulk-email",
    "05-enterprise-automation",
    "06-lead-qualification",
    "social-media-agent",
    "websites",
    "portrait",
]

for base_folder in ["automation-documentation", "workflow-screenshots-review", "additional-screenshots"]:
    for sub in PROJECT_SUBDIRS:
        DIRS.append(WORKSPACE / "portfolio-content" / base_folder / sub)

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_image_info(path: Path):
    try:
        with Image.open(path) as img:
            return {
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "mode": img.mode
            }
    except Exception:
        return None

def main():
    print("--- Creating directory structure ---")
    for d in DIRS:
        d.mkdir(parents=True, exist_ok=True)
    print(f"Created/verified {len(DIRS)} directories.")

    # Collect source files
    scanned_records = []
    hash_map = {}

    print("\n--- Scanning Source Directory ---")
    all_source_files = []
    for root, _, files in os.walk(SOURCE_DIR):
        for f in sorted(files):
            all_source_files.append(Path(root) / f)

    print(f"Total files found in source directory: {len(all_source_files)}")

    for file_path in all_source_files:
        rel_to_source = file_path.relative_to(SOURCE_DIR)
        size_bytes = file_path.stat().st_size
        file_hash = sha256_file(file_path)
        img_info = get_image_info(file_path)

        mime, _ = mimetypes.guess_type(str(file_path))
        if not mime:
            if file_path.suffix.lower() == ".docx":
                mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            elif file_path.suffix.lower() == ".webp":
                mime = "image/webp"
            elif file_path.suffix.lower() == ".svg":
                mime = "image/svg+xml"

        is_dup = file_hash in hash_map
        if is_dup:
            print(f"Duplicate hash detected: {file_path.name} matches {hash_map[file_hash]}")
        else:
            hash_map[file_hash] = str(rel_to_source)

        # Mapping logic
        destinations = []
        project_id = None
        category = None
        notes = ""

        parts = rel_to_source.parts
        top_folder = parts[0]
        sub_folder = parts[1] if len(parts) > 1 else ""
        filename = file_path.name

        if top_folder == "Website Projects Thumbnails":
            category = "website_thumbnail"
            if "SUMERI" in filename:
                project_id = "sumeri"
                if filename.endswith(".webp"):
                    destinations.append(WORKSPACE / "public" / "assets" / "websites" / "sumeri" / "cover.webp")
                destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "websites" / filename)
            elif "Time_And_Tide" in filename:
                project_id = "time-and-tide"
                if filename.endswith(".webp"):
                    destinations.append(WORKSPACE / "public" / "assets" / "websites" / "time-and-tide" / "cover.webp")
                destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "websites" / filename)
            elif "NeoCut_Digital" in filename:
                project_id = "neocut-digital"
                if filename.endswith(".webp"):
                    destinations.append(WORKSPACE / "public" / "assets" / "websites" / "neocut-digital" / "cover.webp")
                destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "websites" / filename)
            elif "SI_Enterprise" in filename:
                project_id = "si-enterprise"
                if filename.endswith(".webp"):
                    destinations.append(WORKSPACE / "public" / "assets" / "apps" / "si-enterprise" / "cover.webp")
                destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "websites" / filename)

        elif top_folder == "AUTOMATION Projects":
            if "Adaptive Human-in-the-Loop" in sub_folder:
                project_id = "01-adaptive-hitl"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "01-adaptive-hitl" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "01-adaptive-hitl" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "01-adaptive-hitl" / filename)
                    notes = "Full n8n workflow screenshot. Held in review until sensitive info is audited."
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "01-adaptive-hitl" / filename)

            elif "AI Content Publishing" in sub_folder:
                project_id = "02-content-publishing"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "02-content-publishing" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "02-content-publishing" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "02-content-publishing" / filename)
                    notes = "Full n8n workflow screenshot. Held in review until sensitive info is audited."
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "02-content-publishing" / filename)

            elif "AI-Powered Lead Generation" in sub_folder:
                project_id = "03-lead-generation"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "03-lead-generation" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "03-lead-generation" / filename)
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "03-lead-generation" / filename)

            elif "Bulk Email Automation" in sub_folder:
                project_id = "04-bulk-email"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "04-bulk-email" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "04-bulk-email" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "04-bulk-email" / filename)
                    notes = "n8n workflow screenshot. Held in review until sensitive info is audited."
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "04-bulk-email" / filename)

            elif "Hybrid Low-Code Enterprise Automation" in sub_folder:
                project_id = "05-enterprise-automation"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "05-enterprise-automation" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "05-enterprise-automation" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "05-enterprise-automation" / filename)
                    notes = "n8n workflow screenshot. Held in review until sensitive info is audited."
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "05-enterprise-automation" / filename)

            elif "Lead Qualification" in sub_folder:
                project_id = "06-lead-qualification"
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    if filename.endswith(".webp"):
                        destinations.append(WORKSPACE / "public" / "assets" / "automations" / "06-lead-qualification" / "cover.webp")
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "06-lead-qualification" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "06-lead-qualification" / filename)
                    notes = "n8n workflow screenshot. Held in review until sensitive info is audited."
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "06-lead-qualification" / filename)
                elif filename.endswith(".html"):
                    category = "documentation_erd"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "06-lead-qualification" / filename)
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "06-lead-qualification" / filename)
                elif filename.endswith(".svg"):
                    category = "architecture_diagram"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "06-lead-qualification" / filename)
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "06-lead-qualification" / filename)

            elif "Social Media Agent_Automation" in sub_folder:
                project_id = "social-media-agent"
                notes = "7th automation project found in source directory (flagged in inventory)."
                if "Thumbnail" in filename:
                    category = "cover_thumbnail"
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "social-media-agent" / filename)
                elif filename.startswith("Screenshot"):
                    category = "workflow_screenshot"
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "social-media-agent" / filename)
                    destinations.append(WORKSPACE / "portfolio-content" / "workflow-screenshots-review" / "social-media-agent" / filename)
                elif filename.endswith(".mp4"):
                    category = "video_demonstration"
                    destinations.append(WORKSPACE / "portfolio-content" / "additional-screenshots" / "social-media-agent" / filename)
                elif filename.endswith((".docx", ".pdf")):
                    category = "documentation"
                    destinations.append(WORKSPACE / "portfolio-content" / "automation-documentation" / "social-media-agent" / filename)

        # Copy files to designated destinations
        copy_results = []
        for dest in destinations:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file_path, dest)
            copy_results.append(str(dest.relative_to(WORKSPACE)).replace("\\", "/"))

        record = {
            "filename": filename,
            "original_relative_path": str(rel_to_source).replace("\\", "/"),
            "original_absolute_path": str(file_path),
            "file_size_bytes": size_bytes,
            "file_size_kb": round(size_bytes / 1024, 2),
            "sha256": file_hash,
            "detected_type": mime,
            "image_dimensions": img_info,
            "proposed_project_id": project_id,
            "category": category,
            "destination_paths": copy_results,
            "copy_status": "copied" if copy_results else "skipped",
            "notes": notes
        }
        scanned_records.append(record)

    # 4. Check for personal portrait in Downloads
    print("\n--- Checking for Personal Portrait and Reference Materials ---")
    portrait_candidates = [
        DOWNLOADS_DIR / "PXL_20260920_085721561.PORTRAIT.jpg"
    ]
    for p_cand in portrait_candidates:
        if p_cand.exists():
            print(f"Found personal portrait: {p_cand.name}")
            p_size = p_cand.stat().st_size
            p_hash = sha256_file(p_cand)
            p_info = get_image_info(p_cand)

            # Copy original to additional-screenshots and public portrait
            dest_orig = WORKSPACE / "public" / "assets" / "portrait" / "portrait.jpg"
            dest_backup = WORKSPACE / "portfolio-content" / "additional-screenshots" / "portrait" / p_cand.name
            dest_orig.parent.mkdir(parents=True, exist_ok=True)
            dest_backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p_cand, dest_orig)
            shutil.copy2(p_cand, dest_backup)

            # Convert to WebP for optimized web loading
            dest_webp = WORKSPACE / "public" / "assets" / "portrait" / "portrait.webp"
            with Image.open(p_cand) as img:
                img.save(dest_webp, "WEBP", quality=92)
            print(f"Generated optimized portrait WebP: {dest_webp}")

            scanned_records.append({
                "filename": p_cand.name,
                "original_relative_path": f"Downloads/{p_cand.name}",
                "original_absolute_path": str(p_cand),
                "file_size_bytes": p_size,
                "file_size_kb": round(p_size / 1024, 2),
                "sha256": p_hash,
                "detected_type": "image/jpeg",
                "image_dimensions": p_info,
                "proposed_project_id": "portrait",
                "category": "personal_portrait",
                "destination_paths": [
                    "public/assets/portrait/portrait.jpg",
                    "public/assets/portrait/portrait.webp",
                    f"portfolio-content/additional-screenshots/portrait/{p_cand.name}"
                ],
                "copy_status": "copied_and_converted",
                "notes": "Original high-res personal portrait photo of Saif Hossain. Converted to WebP for web delivery."
            })

    # Also copy master documentation and reference assets from Downloads into portfolio-content/reference/
    reference_files = [
        "SAIF_HOSSAIN_PORTFOLIO_PROJECT_DOCUMENTATION.md",
        "Saif_Hossain_Portfolio_Project_Plan_and_Wireframe.txt",
        "SAIF_CV.pdf",
        "SAIF HOSSAIN.docx",
        "SAIF HOSSAIN.xlsx",
        "Saif_Update-1.pdf",
        "saif_hossain_cinematic_ai_engineer_portfolio.html"
    ]
    for rf_name in reference_files:
        rf_path = DOWNLOADS_DIR / rf_name
        if rf_path.exists():
            rf_dest = WORKSPACE / "portfolio-content" / "reference" / rf_name
            shutil.copy2(rf_path, rf_dest)
            print(f"Archived reference doc: {rf_name} -> portfolio-content/reference/")

    # 5. Save raw_scanned_assets.json
    output_json_path = WORKSPACE / "portfolio-content" / "inventory" / "raw_scanned_assets.json"
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(scanned_records, f, indent=2)

    print(f"\nSuccessfully wrote {len(scanned_records)} records to {output_json_path}")

if __name__ == "__main__":
    main()
