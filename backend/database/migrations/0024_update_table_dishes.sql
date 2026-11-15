-- 2. Actualizar schema base de platillos con el catálogo estándar del POS JAMF
TRUNCATE TABLE dishes RESTART IDENTITY CASCADE;

INSERT INTO dishes (dish_name, dish_price, dish_category, dish_description, is_active) VALUES
('Torta atún rojo', 38000, 'Entradas', 'Tartar de atún rojo fresco sobre base crujiente con emulsión cítrica y ajonjolí tostado.', true),
('Carpaccio de res trufado', 34000, 'Entradas', 'Finas láminas de lomo de res con aceite de trufa negra, alcaparras y lascas de parmesano.', true),
('Magret de pato', 52000, 'Platos Fuertes', 'Pechuga de pato sellada a término medio con reducción de frutos del bosque y puré rústico.', true),
('Bistec turco', 64000, 'Platos Fuertes', 'Corte premium a la parrilla marinado en especias orientales, acompañado de vegetales asados.', true),
('Salmón noruego', 58000, 'Platos Fuertes', 'Filete de salmón en costra de finas hierbas sobre espejo de salsa de eneldo y espárragos.', true),
('Roulade de ave', 46000, 'Platos Fuertes', 'Suprema de ave rellena de espinaca y queso madurado en salsa cremosa de vino blanco.', true),
('Pechuga a la naranja', 42000, 'Platos Fuertes', 'Suprema de pollo dorada al grill bañada en glaseado cítrico de naranja valencia y romero.', true),
('Bandeja especial JAMF', 48000, 'Platos Fuertes', 'Plato insignia de la casa con corte selecto a la brasa, guarnición criolla y aguacate fresco.', true),
('Ensalada César de la casa', 29000, 'Ensaladas', 'Mix de lechugas romanas orgánicas, crutones artesanales, pollo grillé y aderezo César clásico.', true),
('Ensalada mediterránea tibia', 31000, 'Ensaladas', 'Quinoa real, tomates cherry confitados, queso feta, aceitunas kalamata y vinagreta de albahaca.', true),
('Souffle grand marmier', 28000, 'Postres', 'Suave soufflé horneado al momento perfumado con licor Grand Marnier y helado de vainilla.', true),
('Pavlova de frutos rojos', 26000, 'Postres', 'Merengue crujiente relleno de crema chantilly artesanal y compota fresca de frutos rojos.', true),
('Limonada de frutos rojos y menta', 16000, 'Bebidas', 'Refrescante infusión frappé de frutos rojos silvestres, zumo de limón natural y hierbabuena.', true);