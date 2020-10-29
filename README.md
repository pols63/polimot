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

* **props, attrs, style, cssVars (requerido al menos uno de ellos):** Objetos cuyas propiedades apuntan a las propiedades del elemento a animar. Cada propiedad es un intervalo. La construcción de estos objetos se verá más adelante.

* **startTime (opcional) (por defecto es undefined):** Indica el tiempo en milisegundos en el que iniciará la animación. A diferencia de `delay`, cuando se pasan al constructor varios objetos de configuración, este parámetro indicará en la línea de tiempo global, en qué momento este objeto será tomado en cuenta, a partir de ese momento, la animación ocurrirá luego del tiempo indicado en `delay`.

* **begin (opcional) (por defecto es undefined):** Callback que se ejecuta cuando se inicia la animación por cada elemento de configuración. Si `target` da como resultado más de un elemento a animar, el callback se ejecutará una vez por cada uno de esos elementos.
- **complete (opcional) (por defecto es undefined):** Callback que se ejecuta cuando la animación ha terminado por cada elemento de configuración. Igual que `begin`, si target da como resultado más de un elemento a animar, el callback se ejecutará una vez por cada uno de esos elementos. Si la animación es pausada antes de completar la animación de un elemento, el callback no se ejecutará.

- **update (opcional) (por defecto es undefined):** Callback que se ejecuta por cada frame de la animación. Polimot utiliza internamente la función `requestAnimationFrame` para realizar el renderizado del siguiente frame, haciendo que la animación no se ejecuté si la página no está visible o el navegador está minimizado, por lo que este callback no se ejecutará en esos casos.

Cuando se pasan varios objetos de configuración, cada uno de ellos se ejecutará luego que el primero acabe.

## Target

Es el objeto a animar el cuál puede ser un elemento HTML o cualquier otro objeto. Si se le pasa una cadena, ésta será utilizada para seleccionar elementos HTML por medio de la función `documento.querySelectorAll()` y animarlos a todos. Si se pasa un arreglo, cada elemento será evaluado con el mismo criterio animando a aquellos que sean elementos HTML u objetos, o si es una cadena será utilizada para seleccionar elementos HTML o si es otro arreglo, evaluará sus elementos también. Si el valor pasado no es válido, o si la selección de elementos arrojó una colección de nodos vacía, se arrojará un error.

Si al término de la evaluacón de `target`, el resultado son varios elementos a animar, ocurrirá lo siguiente:

* La propiedad stagger estará disponible.

* Los callback `begin`, `update` y `complete` se ejecutarán por cada elemento encontrado en `target`. Si esto no es lo deseado, puede consultar el apartado de eventos.

## style, props, attrs y cssVars

Cada uno de estas propiedades dentro de un objeto de configuración anima una cualidad diferente en el elemento seleccionado en `target`:

* **style:** Anima propiedades de estilo, aplicable únicamente a los elementos HTML. Las propiedades indicadas dentro deben ser escritas tal como son entregadas por la función `getComputedStyle()`.

* **props:** Anima las propiedades de un objeto.

* **attrs:** Anima atributos de eqitueta, aplicable únicamente a los elementos HTML.

* **cssVars:** Anima variables de estilo CSS, aplicable únicamente a los elementos HTML. Las propiedades indicadas dentro deben ser escritas tal cual como variables CSS, con `--` por delante.

## Tipos de valor para las categorías animables

Las propiedades anidadas dentro de `style`, `props`, `attrs` y `cssVars` pueden ser de tres tipos:

* Número.

* Arreglo.

* Objeto de configuración.

## Valor de propiedad como número

Si las propiedades anidadas en `style`, `props`, `attrs` y `cssVars` son de tipo número, tal valor será el establecido al final de la animación.

Ejemplo:

Para el elemento:

```html
<div></div>
```

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        opacity: 0
    }
})
anim.play()
// La animación modificará el atributo CSS 'opacity' desde el que tenga actualmente hasta 0.
```

El ejemplo anterior funciona bien para atributos que sean de tipo número, pero para aquellos atributos que requieren una unidad, la animación no se apreciará.

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: 0
    }
})
anim.play()
// El div no cambiará de ancho, debido a que en CSS, los atributos de medida requieren se especifique una unidad.
```

Para este caso, se requiere utilizar valores de tipo arreglo.

## Valor de propiedad como arreglo

Si las propiedades anidadas en `style`, `props`, `attrs` y `cssVars` son de tipo arreglo, ocurrirá lo siguiente:

### 1. Se tomarán todos los elementos numéricos. Éstos actuarán como valores clave para animación.

Ejemplo:

Para el elemento:

```html
<div></div>
```

```javascript
// Volviendo con 'opacity'
const anim = new Polimot({
    target: 'div',
    style: {
        opacity: [0, 1, 0.5, 1]
    }
})
anim.play()
// La animación modificará el atributo CSS 'opacity' desde 0 hasta 1, luego hasta 0.5 y finalmente a 1.
```

Tenga en cuenta que en esta ocasión, no se tomará en cuenta valor de `opacity` encontrado en el elemento, sino que será sobreescrito al primer valor del arreglo.

### 2. Si existe algún elemento de tipo cadena, ésta será utilizada como una plantilla para establecer el valor al atributo en animación.

La plantilla debe contener el caracter `?` que será reemplazado por el valor resultante de la animación.

Ejemplo:

Para el elemento:

```html
<div></div>
```

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: [0, 100, 50, '?px']
    }
})
anim.play()
// La animación modificará el atributo CSS 'width' desde 0px hasta 100px, luego hasta 50px.
```

Esto será lo ideal para indicar las unidades de animación:

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        fontSize: [1, 2, '?em']
    }
})
anim.play()
```

El valor de tipo cadena puede estar en cualquier posición del arreglo. Si hay más de un elemento de tipo plantilla, sólo será tomado en cuenta el último:

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        fontSize: [1, '?em', 2, '?px', 3] // idéntico a [1, 2, 3, '?px']
    }
})
anim.play()
```

## 3. Si existe algún valor de tipo función, al igual que el valor de tipo cadena, la función será utilizada para obtener el valor a establecer en el atributo en animación.

Ejemplo:

Para el elemento:

```html
<div></div>
```

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: [0, 100, 50, n => `${n}px`]
    }
})
anim.play()
// La animación modificará el atributo CSS 'width' desde 0px hasta 100px, luego hasta 50px.
```

Pese a que la animación tomará los valores encontrados en el arreglo para hacer el recorrido, la función podría modificar el resultado:

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: [0, 100, 50, n => `${2 * n}px`]
    }
})
anim.play()
// La animación modificará el atributo CSS 'width' desde 0px hasta 200px, luego hasta 100px.
```

## Valor de propiedad como Objeto

Se puede pasar un objeto de configuración que no únicamente determina los valores que se usará en la animación, sino qué tipo de transformación tendrá:

Ejemplo:

Para el elemento:

```html
<div></div>
```

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: {
            values: [0, 100, 50, '?px'],
            easing: 'inElastic'
        }
    }
})
anim.play()
// La animación modificará el atributo CSS 'width' desde 0px hasta 100px, luego hasta 50px.
```

El ejemplo de arriba también se puede representar así:

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        width: {
            values: [0, 100, 50],
            easing: 'inElastic',
            result: n => `${n}px`
        }
    }
})
anim.play()
// La animación modificará el atributo CSS 'width' desde 0px hasta 100px, luego hasta 50px.
```

## Propiedades

El objeto de clase `Polimot` tiene la siguientes propiedades:

* duration (sólo lectura): La duración total de la animación.
