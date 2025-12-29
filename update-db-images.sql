UPDATE products SET image = REPLACE(image, '.png', '.webp') WHERE image LIKE '%.png';
UPDATE products SET image = REPLACE(image, '.jpg', '.webp') WHERE image LIKE '%.jpg';
UPDATE products SET image = REPLACE(image, '.jpeg', '.webp') WHERE image LIKE '%.jpeg';
