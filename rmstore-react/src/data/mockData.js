export const setsIniciales = [
  {
    id: "LEG-001",
    nombre: "Lego Star Wars - Millennium Falcon",
    categoria: "Star Wars",
    precio: 169990,
    stock: 12,
    stockCritico: 3,
    descripcion: "Set coleccionable de la icónica nave con mini figuras de Chewbacca, Han Solo y más.",
    imagen: "https://i5.walmartimages.com/asr/625df3e7-f408-4b69-a52a-4392886a5291.ca5a8df751327ab30c7bb0996141f533.jpeg",
    imagenes: [
      "https://images-na.ssl-images-amazon.com/images/I/91FoS63ClXL.jpg",
      "https://www.tiendalego.cl/cdn/shop/products/75192_prod14_851x851.jpg?v=1745255859",
      "https://www.tiendalego.cl/cdn/shop/products/75192_prod_1000x1000.jpg?v=1773427616"
    ]
  },
  {
    id: "LEG-002",
    nombre: "Lego Technic - Ferrari Daytona SP3",
    categoria: "Technic",
    precio: 349990,
    stock: 5,
    stockCritico: 2,
    descripcion: "Modelo a escala 1:8 con caja de cambios secuencial de 8 velocidades y motor V12.",
    imagen: "https://www.tiendalego.cl/cdn/shop/products/42143_box_1000x1000.jpg?v=1773694256",
    imagenes: [
      "https://www.tiendalego.cl/cdn/shop/products/42143_boxprod_1000x1000.jpg?v=1773694256",
      "https://www.tiendalego.cl/cdn/shop/products/42143_prod_1000x1000.jpg?v=1773694256",
      "https://www.tiendalego.cl/cdn/shop/products/42143_back_03_1000x1000.jpg?v=1773694256"
    ]
  },
  {
    id: "LEG-003",
    nombre: "Lego Harry Potter - Castillo de Hogwarts",
    categoria: "Harry Potter",
    precio: 399990,
    stock: 8,
    stockCritico: 2,
    descripcion: "Microescala del legendario castillo con aulas, torres y el Gran Comedor.",
    imagen: "https://www.tiendalego.cl/cdn/shop/products/71043_box_1000x1000.jpg?v=1745256791",
    imagenes: [
      "https://www.tiendalego.cl/cdn/shop/products/71043_boxprod_851x851.jpg?v=1745256791",
      "https://www.tiendalego.cl/cdn/shop/products/71043_prod_851x851.jpg?v=1745256791",
      "https://www.tiendalego.cl/cdn/shop/products/71043_back_01_851x851.jpg?v=1745256791"
    ]
  },
  {
    id: "LEG-004",
    nombre: "Lego City - Estación de Bomberos",
    categoria: "City",
    precio: 49990,
    stock: 20,
    stockCritico: 5,
    descripcion: "Cuartel de bomberos de 3 niveles con camión, helicóptero y 5 minifiguras.",
    imagen: "https://m.media-amazon.com/images/I/81HYayz4mrL.jpg",
    imagenes: [
      "https://m.media-amazon.com/images/I/81HYayz4mrL.jpg",
      "https://cdn.toypro.com/media/cache/tp_product_detail/uploads/images/product/10/19006.webp",
      "https://images-na.ssl-images-amazon.com/images/I/81fm8ea5j6L.jpg"
    ]
  },
  {
    id: "LEG-005",
    nombre: "Lego Icons - Ramo de Flores Silvestres",
    categoria: "Icons",
    precio: 59990,
    stock: 15,
    stockCritico: 4,
    descripcion: "Arreglo floral realista construido completamente con piezas LEGO.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_702394-MLA99937500525_112025-F.webp",
    imagenes: [
      "https://http2.mlstatic.com/D_NQ_NP_2X_702394-MLA99937500525_112025-F.webp",
      "https://http2.mlstatic.com/D_NQ_NP_2X_777335-MLA84548544358_052025-F.webp",
      "https://http2.mlstatic.com/D_NQ_NP_2X_842437-MLA84846916913_052025-F.webp"
    ]
  },
  {
    id: "LEG-006",
    nombre: "Lego Marvel - Guantelete del Infinito",
    categoria: "Marvel",
    precio: 79990,
    stock: 10,
    stockCritico: 3,
    descripcion: "Recreación dorada del Guantelete de Thanos con las 6 Gemas del Infinito.",
    imagen: "https://http2.mlstatic.com/D_NQ_NP_963272-CBT110839248748_052026-O-lego-marvel-super-heroes-76191-guantelete-del-infinito.webp",
    imagenes: [
      "https://http2.mlstatic.com/D_NQ_NP_695847-CBT109845875685_032026-O.webp",
      "https://http2.mlstatic.com/D_NQ_NP_953428-CBT110838674122_052026-O-lego-marvel-super-heroes-76191-guantelete-del-infinito.webp",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzt0ozPMPC83d1vs3MXR7qXIDHOeBNAq3Fk_358gyPBWWqHTAiAVrprGsW&s=10"
    ]
  }
];

export const usuariosIniciales = [
  {
    run: "11111111K",
    nombre: "Julián",
    apellidos: "Romero",
    email: "admin@duoc.cl",
    pass: btoa("admin123"),
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    direccion: "Av. España 123",
    rol: "ADMIN"
  },
  {
    run: "184561239",
    nombre: "Camila",
    apellidos: "Silva",
    email: "camila@gmail.com",
    pass: btoa("camila123"),
    region: "Región de Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle Libertad 456",
    rol: "VENDEDOR"
  },
  {
    run: "201237895",
    nombre: "Pedro",
    apellidos: "Soto",
    email: "pedro.soto@gmail.com",
    pass: btoa("cliente123"),
    region: "Región del Biobío",
    comuna: "Concepción",
    direccion: "Los Carrera 789",
    rol: "CLIENTE"
  }
];

export const regionesYComunas = [
  {
    region: "Región de Valparaíso",
    comunas: ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana", "Concón"]
  },
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "Puente Alto"]
  },
  {
    region: "Región de la Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"]
  },
  {
    region: "Región de Ñuble",
    comunas: ["Chillán", "San Carlos", "Bulnes", "Yungay"]
  },
  {
    region: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Los Ángeles"]
  }
];