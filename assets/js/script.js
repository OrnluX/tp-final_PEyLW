const navbar = document.getElementById('navbar')
const menuToggle = document.getElementById('menu-toggle')
const menuIcon = document.getElementById('menu-icon')
const navLinks = document.getElementById('nav-links')
const themeToggle = document.getElementById('theme-toggle')
const body = document.body
const contenedor = document.getElementById('productos')

// Cambiar color de fondo del navbar al hacer scroll
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

// Cambiar tema al hacer clic en el toggle
themeToggle.addEventListener('change', () => {
  const isDark = themeToggle.checked
  document.body.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

// Aplicar tema guardado o del sistema al cargar la página
window.addEventListener('DOMContentLoaded', applySavedOrSystemTheme)

// ************************** Carrito de Compras ******************************** //

// Definir el carrito como un array vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || []

// Contador del carrito
const contadorCarrito = document.getElementById('contador-carrito')

// Actualiza visualmente el contador del carrito
function actualizarContador() {
  const total = carrito.reduce((acumulador, producto) => {
    return acumulador + producto.quantity
  }, 0)
  contadorCarrito.textContent = total
}

//Funcion para actualizar estados
function guardarYActualizar() {
  localStorage.setItem('carrito', JSON.stringify(carrito))
  actualizarContador()
  calcularTotal()
  mostrarProductosEnPanel()
}

//Mostar el contador del carrito al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  guardarYActualizar()
})

//Agregar un producto al carrito
function agregarAlCarrito(producto) {
  const index = carrito.findIndex((item) => item.id === producto.id)
  if (index !== -1) {
    carrito[index].quantity += 1
  } else {
    const productoCarrito = {
      ...producto,
      quantity: 1,
    }
    carrito.push(productoCarrito)
  }
  guardarYActualizar()
  console.log(`Producto añadido: ${producto.title}`)
  mostrarToast(`"${producto.title}" añadido al carrito!`)
}

// Mostrar notificación de éxito al agregar un producto al carrito
function mostrarToast(mensaje) {
  const toastContainer = document.getElementById('toast-container')

  const toast = document.createElement('div')
  toast.className = 'toast'

  const icon = document.createElement('img')
  icon.src = 'assets/icons/check.png'
  icon.alt = 'Icono de verificación'
  icon.className = 'toast-icon'

  const text = document.createElement('span')
  text.textContent = mensaje

  toast.appendChild(icon)
  toast.appendChild(text)
  toastContainer.appendChild(toast)

  // Elimina el toast después de 3 segundos
  setTimeout(() => {
    toast.remove()
  }, 3000)
}

//Vaciar el carrito
function vaciarCarrito() {
  carrito = [] // vacía el array en memoria
  localStorage.removeItem('carrito') // elimina la clave del almacenamiento
  guardarYActualizar() // actualiza visualmente el contador a 0
  console.log('Carrito vaciado')
}

//Mostrar el carrito al hacer clic en el botón
const carritoBoton = document.getElementById('carrito-boton')
const carritoPanel = document.getElementById('carrito-panel')
const carritoLista = document.getElementById('carrito-lista')
const carritoVacio = document.getElementById('carrito-vacio')

carritoBoton.addEventListener('click', () => {
  carritoPanel.classList.toggle('visible')
  carritoPanel.classList.toggle('oculto')
  mostrarProductosEnPanel()
})

//Función para mostrar los productos en el panel del carrito
function mostrarProductosEnPanel() {
  carritoLista.innerHTML = '' // Limpiar

  if (carrito.length === 0) {
    carritoVacio.style.display = 'block'
    return
  }

  carritoVacio.style.display = 'none'

  carrito.forEach((producto) => {
    const li = document.createElement('li')
    li.className = 'carrito-item'

    const img = document.createElement('img')
    img.src = producto.image
    img.alt = producto.title
    img.className = 'miniatura'

    const texto = document.createElement('div')
    texto.className = 'carrito-detalles'
    const nombre = document.createElement('p')
    nombre.className = 'nombre'
    nombre.textContent = producto.title

    const precio = document.createElement('p')
    precio.className = 'precio'
    precio.textContent = `$${producto.price.toFixed(2)}`

    // Crear botón de eliminar producto
    const botonEliminar = document.createElement('button')
    botonEliminar.className = 'btn-cantidad eliminar'
    botonEliminar.setAttribute('aria-label', 'Eliminar producto')
    const iconoEliminar = document.createElement('i')
    iconoEliminar.className = 'fas fa-trash-alt'
    botonEliminar.appendChild(iconoEliminar)

    botonEliminar.addEventListener('click', () => {
      eliminarProducto(producto.id)
      mostrarToast(`"${producto.title}" eliminado del carrito!`)
    })

    //Botones para sumar y restar cantidad de productos
    const controlesCantidad = document.createElement('div')
    controlesCantidad.className = 'controles-cantidad'

    //Restar cantidad
    const botonRestar = document.createElement('button')
    botonRestar.classList.add('btn-cantidad', 'restar')
    botonRestar.setAttribute('aria-label', 'Restar cantidad')
    iconoRestar = document.createElement('i')
    botonRestar.appendChild(iconoRestar)

    if (producto.quantity > 1) {
      iconoRestar.className = 'fa-solid fa-square-minus'
      botonRestar.addEventListener('click', () => {
        restarCantidad(producto.id)
      })
    } else {
      iconoRestar.className = 'fas fa-trash-alt'
      botonRestar.addEventListener('click', () => {
        eliminarProducto(producto.id)
        mostrarToast(`"${producto.title}" eliminado del carrito!`)
      })
    }

    //Cantidad
    const cantidad = document.createElement('span')
    cantidad.className = 'cantidad'
    cantidad.textContent = producto.quantity

    //Sumar cantidad
    const botonSumar = document.createElement('button')
    botonSumar.classList.add('btn-cantidad', 'sumar')
    botonSumar.setAttribute('aria-label', 'Sumar cantidad')
    const iconoSumar = document.createElement('i')
    iconoSumar.className = 'fa-solid fa-square-plus'
    botonSumar.appendChild(iconoSumar)
    botonSumar.addEventListener('click', () => {
      sumarCantidad(producto.id)
    })

    //Se agregan los elementos
    controlesCantidad.appendChild(botonRestar)
    controlesCantidad.appendChild(cantidad)
    controlesCantidad.appendChild(botonSumar)

    texto.appendChild(nombre)
    texto.appendChild(precio)
    texto.appendChild(controlesCantidad)

    li.appendChild(img)
    li.appendChild(texto)
    li.appendChild(botonEliminar)

    carritoLista.appendChild(li)
  })
}

//FUNCIONES PARA SUMAR Y RESTAR CANTIDAD DE PRODUCTOS
function sumarCantidad(id) {
  const index = carrito.findIndex((item) => item.id === id)
  if (index !== -1) {
    carrito[index].quantity += 1
    guardarYActualizar()
  }
}

function restarCantidad(id) {
  const index = carrito.findIndex((item) => item.id === id)
  if (index !== -1) {
    carrito[index].quantity -= 1
    if (carrito[index].quantity <= 0) {
      carrito.splice(index, 1)
    }
    guardarYActualizar()
  }
}

function eliminarProducto(id) {
  carrito = carrito.filter((producto) => producto.id !== id)
  guardarYActualizar()
}

//Calcular el total del carrito
function calcularTotal() {
  const total = carrito.reduce((suma, producto) => {
    return suma + producto.price * producto.quantity
  }, 0)

  const totalElemento = document.querySelector('#total-carrito')
  if (totalElemento) {
    totalElemento.textContent = `Total: $${total.toFixed(2)}`
  }
}

// ************************** API **************************** //

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

      // Crear botón de "Agregar al carrito"
      const btn = document.createElement('button')
      btn.className = 'primary-btn'
      btn.textContent = 'Agregar al carrito'
      btn.addEventListener('click', () => {
        agregarAlCarrito(producto)
      })

      // Agregar elementos a la tarjeta
      card.appendChild(img)
      card.appendChild(title)
      card.appendChild(category)
      card.appendChild(price)
      card.appendChild(btn)
      // Agregar tarjeta al contenedor
      contenedor.appendChild(card)
    })
  )
  .catch((error) => {
    console.error('Error al cargar los productos:', error)
    const errorMessage = document.createElement('p')
    errorMessage.textContent = 'Error al cargar los productos.'
    contenedor.appendChild(errorMessage)
  })
