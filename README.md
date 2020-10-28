# POLIMOT

Librería de animación para su uso JavaScript. Puede animar propiedades, atributos y estilos tanto de elementos HTML como de objetos.

## Empezar

Importe el script utilizando la etiqueta:

```html
<script src="polimot.js"></script>
```

## Animando un elemento HTML

```javascript
let anim = new Polimot({
    target: document.querySelector('div') //o tan sólo 'div'
    style: {
        height: [0, 100, '?px'],
        opacity: [0, 1]
    }
})
anim.play()
```

## Animando un objeto

```javascript
let obj = { qwe: 34 }
let anim = new Polimot({
    target: obj
    props: {
        qwe: [23, 78]
    },
    update(e) {
        console.log(e.target)
    }
})
anim.play()
```

## Configurando la animación

La función constructora puede recibir uno o más parámetros. Cada uno de ellos debe ser un objeto de configuración en la que se puede definir las siguientes propiedades:

* **target (requerido):** Es el objeto a animar el cuál puede ser un elemento HTML o cualquier otro objeto. Si se le pasa una cadena, ésta será utilizada para seleccionar elementos HTML por medio de la función `documento.querySelectorAll()` y animarlos a todos. Si se pasa un arreglo, cada elemento será evaluado con el mismo criterio animando a aquellos que sean elementos HTML u objetos, o si es una cadena será utilizada para seleccionar elementos HTML o si es otro arreglo, evaluará sus elementos también. Si el valor pasado no es válido, o si la selección de elementos arrojó una colección de nodos vacía, se arrojará un error.

* **duration (opcional) (por defecto igual a 1000):** Tiempo de duración de la animación en milisegundos.

* **stagger (opcional) (por defecto igual a 0):** Es aplicable cuando `target` luego de ser evaluado da como resultado una colección de elementos, de ser así, la animación para cada elemento empezará con un retraso respecto al anterior según el valor entregado en milisegundos.

* **steps (opcional) (por defecto igual a 0):** Si se pasa un número mayor a 0, la animación tendrá una cantidad igual en saltos.

* **delay (opcional) (por defecto es igual a 0):** Tiempo en milisegundos en que la animación demorará en iniciarse. Este valor se sumará a `stagger` para cada uno de los elementos.

* **begin (opcional) (por defecto es undefined):** Callback que se ejecuta cuando se inicia la animación por cada elemento de configuración. Si `target` da como resultado más de un elemento a animar, el callback se ejecutará una vez por cada uno de esos elementos.

* **complete (opcional) (por defecto es undefined):** Callback que se ejecuta cuando la animación ha terminado por cada elemento de configuración. Igual que `begin`, si target da como resultado más de un elemento a animar, el callback se ejecutará una vez por cada uno de esos elementos. Si la animación es pausada antes de completar la animación de un elemento, el callback no se ejecutará.

* **update (opcional) (por defecto es undefined):** Callback que se ejecuta por cada frame de la animación. Polimot utiliza internamente la función `requestAnimationFrame` para realizar el renderizado del siguiente frame, haciendo que la animación no se ejecuté si la página no está visible o el navegador está minimizado, por lo que este callback no se ejecutará en esos casos.

* **props, attrs, style, cssVars (requerido al menos uno de ellos):** Objetos cuyas propiedades apuntan a las propiedades del elemento a animar. Cada propiedad es un intervalo. La construcción de estos objetos se verá más adelante.

### props, attrs, style, cssVars

Propiedades del elemento en animación. Las propiedades indicadas aquí se actualizarán en cada frame cuando la animación este corriendo.


