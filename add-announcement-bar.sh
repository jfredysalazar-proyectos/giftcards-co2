#!/bin/bash

# Páginas a actualizar
pages=(
  "client/src/pages/Contact.tsx"
  "client/src/pages/FAQ.tsx"
  "client/src/pages/HelpCenter.tsx"
  "client/src/pages/PrivacyPolicy.tsx"
  "client/src/pages/RefundPolicy.tsx"
  "client/src/pages/TermsOfService.tsx"
  "client/src/pages/MyOrders.tsx"
)

for page in "${pages[@]}"; do
  echo "Processing $page..."
  
  # Verificar si ya tiene el import
  if ! grep -q "import AnnouncementBar" "$page"; then
    # Agregar import después de los imports existentes
    sed -i '/^import/a import AnnouncementBar from "@/components/AnnouncementBar";' "$page"
  fi
  
  # Agregar AnnouncementBar después del div principal si no existe
  if ! grep -q "<AnnouncementBar />" "$page"; then
    sed -i 's/<div className="min-h-screen/<AnnouncementBar \/>\n      <div className="min-h-screen/g' "$page"
  fi
done

echo "Done!"
