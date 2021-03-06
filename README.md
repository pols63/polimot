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

## Configurando la animación: timelines

La función constructora puede recibir uno o más parámetros. Cada uno de ellos debe ser un objeto de configuración (también llamados `timeline`) en la que se puede definir las siguientes propiedades:

* **target (requerido):** Es el objeto a animar el cuál puede ser un elemento HTML o cualquier otro objeto. Si se le pasa una cadena, ésta será utilizada para seleccionar elementos HTML por medio de la función `documento.querySelectorAll()` y animarlos a todos. Si se pasa un arreglo, cada elemento será evaluado con el mismo criterio animando a aquellos que sean elementos HTML u objetos, o si es una cadena será utilizada para seleccionar elementos HTML o si es otro arreglo, evaluará sus elementos también. Si el valor pasado no es válido, o si la selección de elementos arrojó una colección de nodos vacía, se arrojará un error.

* **duration (opcional) (por defecto igual a 1000):** Tiempo de duración de la animación del timeline en milisegundos.

* **stagger (opcional) (por defecto igual a 0):** Es aplicable cuando `target` luego de ser evaluado da como resultado una colección de elementos, de ser así, la animación para cada elemento empezará con un retraso respecto al anterior según el valor entregado en milisegundos.

* **steps (opcional) (por defecto igual a 0):** Si se pasa un número mayor a 0, la animación tendrá una cantidad igual en saltos.

* **delay (opcional) (por defecto es igual a 0):** Tiempo en milisegundos en que la animación demorará en iniciarse. Este valor se sumará a `stagger` para cada uno de los elementos.

* **props, attrs, style, cssVars (requerido al menos uno de ellos):** Objetos cuyas propiedades apuntan a las propiedades del elemento a animar. Cada propiedad es un intervalo. La construcción de estos objetos se verá más adelante.

* **startTime (opcional) (por defecto es undefined):** Indica el tiempo en milisegundos en el que iniciará la animación. A diferencia de `delay`, cuando se pasan al constructor varios timelines, este parámetro indicará en la línea de tiempo global, en qué momento este objeto será tomado en cuenta, a partir de ese momento, la animación ocurrirá luego del tiempo indicado en `delay`. Cuando se pasan varios timelines, cada uno de ellos será puesto después del anterior si es que no se ha especificado manualmente la propiedad `startTime`.

* **begin (opcional) (por defecto es undefined):** Callback que se ejecuta cuando se inicia la animación por cada elemento de configuración.
- **complete (opcional) (por defecto es undefined):** Callback que se ejecuta cuando la animación ha terminado por cada elemento de configuración. Si la animación es pausada antes de completar la animación de un elemento, el callback no se ejecutará.

- **update (opcional) (por defecto es undefined):** Callback que se ejecuta por cada frame de la animación. Polimot utiliza internamente la función `requestAnimationFrame` para realizar el renderizado del siguiente frame, haciendo que la animación no se ejecuté si la página no está visible o el navegador está minimizado, por lo que este callback no se ejecutará en esos casos.

## Target

Es el objeto a animar el cuál puede ser un elemento HTML o cualquier otro objeto. Si se le pasa una cadena, ésta será utilizada para seleccionar elementos HTML por medio de la función `documento.querySelectorAll()` y animarlos a todos. Si se pasa un arreglo, cada elemento será evaluado con el mismo criterio animando a aquellos que sean elementos HTML u objetos, o si es una cadena será utilizada para seleccionar elementos HTML o si es otro arreglo, evaluará sus elementos también. Si el valor pasado no es válido, o si la selección de elementos arrojó una colección de nodos vacía, se arrojará un error.

Si al término de la evaluacón de `target`, el resultado son varios elementos a animar, la propiedad del timeline `stagger` estará disponible.

## begin, complete y update

Los callbacks `begin`, `complete` y `update` se ejecutan de la siguiente forma:

* Cuando un timeline inicia su animación, se ejecuta el callback `begin`.
* Mientras la animación ocurre, se irá ejecutando el callback `update`, siempre que la animación sea visible.
* Cuando un timeline termina su animación, se ejecuta el callback `complete`.

¿Qué ocurre cuando una animación no es visible?:

* Debido a que Polimot utiliza la función requestAnimationFrame para realizar las animaciones, los callbacks no siempre serán llamado en el momento de empezar, actualizar o terminar la animación.

* Si una animación inició y terminó no están visible el navegador, los callbacks `begin` y `complete` se reservan hasta que la página llegue a estar visible, recién en ese momento serán ejecutados, pero note que el callback `update` no habrá sido llamado ni una sola vez.

Utilice los callbacks para expandir las posibilidades de animación y no como temporizadores.

## Categorías animables: style, props, attrs y cssVars

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

### Valor de propiedad como número

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

### Valor de propiedad como arreglo

Si las propiedades anidadas en `style`, `props`, `attrs` y `cssVars` son de tipo arreglo, ocurrirá lo siguiente:

#### 1. Se tomarán todos los elementos numéricos. Éstos actuarán como valores clave para animación.

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

#### 2. Si existe algún elemento de tipo cadena, ésta será utilizada como una plantilla para establecer el valor al atributo en animación.

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

#### 3. Si existe algún valor de tipo función, al igual que el valor de tipo cadena, la función será utilizada para obtener el valor a establecer en el atributo en animación.

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

## La categoría de animación "style"

En la categoría `style` se puede referencias a cualquier propiedad `css`, pero existe una mejora con respecto a las funciones que van dentro de la propiedad `transform`, ya que tales funciones pueden ser propiedades animables dentro de `style`:

Ejemplo:

```javascript
const anim = new Polimot({
    target: 'div',
    style: {
        scaleX: [0.5, 1.5], /* scale no requiere unidades */
        rotate: [0, 360, '?deg']
    }
})
```

## Propiedades

El objeto creado de clase `Polimot` tiene la siguientes propiedades:

* **duration (sólo lectura):** La duración total de la animación.
* **speed (lectura/escritura):** La velocidad de la animación.
* **direction (lectura/escritura):** La dirección de la animación, adopta sólo dos valores: `normal` y `reverse`.
* **currentTime (lectura/escritura):** El tiempo actual en que la animación se encuentra con respecto a `duration`.
* status (sólo lectura): Indica el estado de la animación. Puede entregar sólo dos valores: `paused` y `playing`. Si una animación se termina, su estado será `paused`.

## Métodos

* **on(eventName, handler):** Agrega un evento de nombre `eventName`. Ambos parámetros son requeridos. eventName sólo puede ser `begin`, `update` y `complete`.
* **off(eventName, handler):** Elimina un evento de nombre `eventName`. Sólo el segundo parámetro es opcional y cuando es pasado, sólo se elimina del evento `eventName` la función `handler`. Si el segundo parámetro no se pasa, se eliminan todos los manejadores de `eventName`.

Ejemplo:

```javascript
const anim = new Polimot(/* timelines */)
const begin1 = event => console.log('begin 1')
const begin2 = event => console.log('begin 2')
anim.on('begin', begin1)
anim.on('begin', begin2)
anim.play()
/* En consola se verá: 'begin 1' y 'begin 2' */
anim.off('begin', begin1)
anim.play()
/* En consola se verá: 'begin 2' */
anim.off('begin') /* Elimina todos los manejadores para 'begin' */
anim.play()
/* Sin mensajes en la consola. */
```

* **play():** Inicia la animación o la continua en caso haya sido pausada antes de acaba.

* **pause():** Pausa la animación.

* **restart():** Detiene la animación y la reinicia a su primer frame teniendo en cuenta el valor de `direction`.

* **toggleDirection():** Permuta el valor de la propiedad `direction` entre `normal` y `reverse`.

* **add(timeline):** Agrega un nuevo timeline al final de todos los establecidos previamente.

## Eventos

Los eventos se ejecután para toda la animación, mientras que los callback son llamados por timeline. Los eventos disponibles son `begin`, `update` y complete y su lógica de ejecución es la misma que la de l,os callbacks.
