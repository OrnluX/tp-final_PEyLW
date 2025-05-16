const navbar = document.getElementById('navbar')
const menuToggle = document.getElementById('menu-toggle')
const menuIcon = document.getElementById('menu-icon')
const navLinks = document.getElementById('nav-links')
const themeToggle = document.getElementById('theme-toggle')
const body = document.body
const contenedor = document.getElementById('productos')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
})

// Cambiar ícono y clase del menú
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active')
  const isOpen = navLinks.classList.contains('active')
  menuIcon.src = isOpen
    ? 'assets/icons/icons8-close.svg'
    : 'assets/icons/icons8-menu.svg'
  menuIcon.alt = isOpen ? 'Cerrar menú' : 'Abrir menú'
})

// Detectar sistema o tema guardado
function applySavedOrSystemTheme() {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (saved === 'dark' || (!saved && prefersDark)) {
    document.body.classList.add('dark')
    themeToggle.checked = true
  } else {
    document.body.classList.remove('dark')
    themeToggle.checked = false
  }
}

themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked
  document.body.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

window.addEventListener('DOMContentLoaded', applySavedOrSystemTheme)

// Cargar productos desde la API y crear tarjetas dinámicamente
fetch('https://fakestoreapi.com/products')
  .then((response) => response.json())
  .then((data) =>
    data.forEach((producto) => {
      const card = document.createElement('div')
      card.classList.add('card')
      const img = document.createElement('img')
      img.setAttribute('src', producto.image)
      img.setAttribute('alt', producto.title)

      const title = document.createElement('h3')
      title.textContent = producto.title

      const category = document.createElement('p')
      category.textContent = producto.category

      const price = document.createElement('p')
      price.className = 'price'
      price.textContent = `$${producto.price.toFixed(2)}`

      // Crear botón de "Agregar a favoritos"
      // const btnFavorite = document.createElement('button')
      // btnFavorite.className = 'add-to-favorite'
      // btnFavorite.textContent = '❤️'
      // btnFavorite.addEventListener('click', () => {
      //   console.log(`❤️ Producto añadido a favoritos: ${producto.title}`)
      //   alert(`Producto añadido a favoritos:\n${producto.title}`)
      // })

      // Crear botón de "Agregar al carrito"
      const btn = document.createElement('button')
      btn.className = 'add-to-cart'
      btn.textContent = 'Agregar al carrito'
      btn.addEventListener('click', () => {
        console.log(`🛒 Producto añadido: ${producto.title}`)
        alert(`Producto añadido al carrito:\n${producto.title}`)
      })

      card.appendChild(img)
      card.appendChild(title)
      card.appendChild(category)
      card.appendChild(price)
      card.appendChild(btn)
      // card.appendChild(btnFavorite)

      contenedor.appendChild(card)
    })
  )
  .catch((error) => {
    console.error('Error al cargar los productos:', error)
    const errorMessage = document.createElement('p')
    errorMessage.textContent = 'Error al cargar los productos.'
    contenedor.appendChild(errorMessage)
  })
