const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})

let enemyMonster
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()


  const toggleBtn = document.getElementById('toggleStatsBtn');
const statsPanel = document.getElementById('enemyStatsPanel');

toggleBtn.addEventListener('click', () => {
  statsPanel.style.display = statsPanel.style.display === 'none' ? 'block' : 'none';
});

// OPTIONAL: update info panel saat battle dimulai
function updateEnemyInfoPanel(monster) {
  document.getElementById('panelEnemyType').innerText = `Type: ${monster.type}`;
  document.getElementById('panelEnemyStats').innerText = 
    `HP: ${monster.baseStats.hp} | Mana: ${monster.baseStats.mana} | Speed: ${monster.baseStats.speed}`;
}

updateEnemyInfoPanel(monsters.Draggle); // Saat lawannya Draggle
// atau
updateEnemyInfoPanel(monsters.Bulabu);  // Saat lawannya Bulabu

// contoh penggunaan saat battle mulai
// updateEnemyInfoPanel(monsters.Bulabu);


  // Set Emby (pemain)
  emby = new Monster(monsters.Emby)
  emby.currentMana = 100

  // Random spawn antara Draggle dan Bulabu
// Random spawn antara Draggle dan Bulabu
const enemyChoices = [monsters.Draggle, monsters.Bulabu]
const chosenEnemyData = enemyChoices[Math.floor(Math.random() * enemyChoices.length)]

enemyMonster = new Monster(chosenEnemyData)
enemyMonster.currentMana = 100

// Update info panel sesuai musuh aktif
updateEnemyInfoPanel(chosenEnemyData)


  // Baru setelah itu update nama di UI
  document.querySelector('#enemyName').innerHTML = enemyMonster.name

  // Update UI Mana bar
  document.querySelector('#playerManaBar').style.width = '100%'
  document.querySelector('#enemyManaBar').style.width = '100%'

  // ...



  renderedSprites = [enemyMonster, emby]
  queue = []

  // Buat tombol serangan
  emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })

  // Listener tombol serangan
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]

      // Emby menyerang
      if (selectedAttack.name === 'Fireball') {
        emby.currentMana = Math.max(emby.currentMana - 20, 0)
        gsap.to('#playerManaBar', {
          width: emby.currentMana + '%'
        })
      }

      emby.attack({
        attack: selectedAttack,
        recipient: enemyMonster,
        renderedSprites
      })

      if (enemyMonster.health <= 0) {
        queue.push(() => {
          enemyMonster.faint()
        })
        queue.push(() => {
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#overlappingDiv', { opacity: 0 })
              battle.initiated = false
              audio.Map.play()
            }
          })
        })
      }

      const availableEnemyAttacks = enemyMonster.attacks.filter(attack => enemyMonster.currentMana >= 20 || attack.name !== 'Fireball')
      const selectedEnemyAttack = availableEnemyAttacks[Math.floor(Math.random() * availableEnemyAttacks.length)]

      queue.push(() => {
        // Musuh menyerang
        if (selectedEnemyAttack.name === 'Fireball') {
          enemyMonster.currentMana = Math.max(enemyMonster.currentMana - 20, 0)
          gsap.to('#enemyManaBar', {
            width: enemyMonster.currentMana + '%'
          })
        }

        enemyMonster.attack({
          attack: selectedEnemyAttack,
          recipient: emby,
          renderedSprites
        })

        if (emby.health <= 0) {
          queue.push(() => {
            emby.faint()
          })
          queue.push(() => {
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'
                gsap.to('#overlappingDiv', { opacity: 0 })
                battle.initiated = false
                audio.Map.play()
              }
            })
          })
        }
      })
    })

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attackType').innerHTML = selectedAttack.type
      document.querySelector('#attackType').style.color = selectedAttack.color
    })
  })
}


function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()

  renderedSprites.forEach((sprite) => {
    sprite.draw()
  })
}

animate()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
