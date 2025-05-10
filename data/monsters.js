const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },

  Draggle: {
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    type: 'Tree',
    baseStats: {
      hp: 100,
      mana: 80,
      speed: 30
    },
    attacks: [attacks.Tackle, attacks.Fireball]
  },

  Bulabu: {
    position: {
      x: 780,  // dulunya 800
      y: -120 // dulunya 100
    },
    image: {
      src: './img/bulabu-removebg-preview.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    animate: true,
    isEnemy: true,
    name: 'Bulabu',
    type: 'Darkness',
    baseStats: {
      hp: 100,
      mana: 80,
      speed: 30
    },
    attacks: [attacks.Tackle, attacks.Fireball]
  }
};
