#!/usr/bin/env python3
import re

pages = [
    "client/src/pages/Contact.tsx",
    "client/src/pages/FAQ.tsx",
    "client/src/pages/HelpCenter.tsx",
    "client/src/pages/PrivacyPolicy.tsx",
    "client/src/pages/RefundPolicy.tsx",
    "client/src/pages/TermsOfService.tsx",
    "client/src/pages/MyOrders.tsx"
]

for page in pages:
    print(f"Fixing {page}...")
    
    with open(page, 'r') as f:
        content = f.read()
    
    # Eliminar imports duplicados de AnnouncementBar
    lines = content.split('\n')
    seen_announcement_import = False
    new_lines = []
    
    for line in lines:
        if 'import AnnouncementBar' in line:
            if not seen_announcement_import:
                new_lines.append(line)
                seen_announcement_import = True
        else:
            new_lines.append(line)
    
    content = '\n'.join(new_lines)
    
    # Corregir estructura JSX: envolver AnnouncementBar y div en un fragment o div padre
    # Buscar patrón: <AnnouncementBar />\n      <div className="min-h-screen
    pattern = r'(<AnnouncementBar />)\s*(<div className="min-h-screen)'
    if re.search(pattern, content):
        content = re.sub(pattern, r'<>\n      \1\n      \2', content)
        
        # Agregar cierre de fragment al final del return
        # Buscar el último </div> antes del cierre del return
        content = re.sub(r'(</div>\s*</div>\s*</div>\s*)\s*\);', r'\1\n    </>\n  );', content)
    
    with open(page, 'w') as f:
        f.write(content)
    
    print(f"Fixed {page}")

print("Done!")
