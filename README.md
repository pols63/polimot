# POLIMOT

Librería de animación para JavaScript. Puede animar propiedades, atributos y estilos tanto de elementos HTML como de objetos.

## Uso

### Animando un elemento HTML

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

Animando un objeto

```javascript
let obj = {qwe: 34}
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
















