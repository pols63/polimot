class Color {

	get red() {
		return this._.red
	}

	set red(value) {
		value = Number(value)
		if (isNaN(value)) value = 0
		this._.red = value
	}

	get green() {
		return this._.green
	}

	set green(value) {
		value = Number(value)
		if (isNaN(value)) value = 0
		this._.green = value
	}

	get blue() {
		return this._.blue
	}

	set blue(value) {
		value = Number(value)
		if (isNaN(value)) value = 0
		this._.blue = value
	}

	static change(colorBegin, colorDest, method) {
		let color = new Color()
		if (typeof method !== 'function') {
			color.red = colorDest.red
			color.green = colorDest.green
			color.blue = colorDest.blue
		} else {
			color.red = Math.round(method(colorBegin.red, colorDest.red))
			color.green = Math.round(method(colorBegin.green, colorDest.green))
			color.blue = Math.round(method(colorBegin.blue, colorDest.blue))
		}
		return color
	}

	static zeroPad(number) {
		return Array(Math.max(2 - number.toString().length + 1, 0)).join('0') + number
	}

	constructor(value) {
		this._ = {
			red: 0,
			green: 0,
			blue: 0
		}

		if (!value || value.search(/^#[A-Fa-f0-9]{6}$/) === -1) return
		value = parseInt('0x' + value.substr(1))
		this._.red = Math.floor(value / (256 * 256))
		this._.green = Math.floor((value % (256 * 256)) / 256)
		this._.blue = (value % (256 * 256)) % 256

	}

	change(colorDest, method) {
		if (typeof method !== 'function') {
			this._.red = colorDest.red
			this._.green = colorDest.green
			this._.blue = colorDest.blue
		} else {
			this._.red = method(this._.red, colorDest.red)
			this._.green = method(this._.green, colorDest.green)
			this._.blue = method(this._.blue, colorDest.blue)
		}
	}

	toString() {
		return `#${Color.zeroPad(this._.red.toString(16).toUpperCase())}${Color.zeroPad(this._.green.toString(16).toUpperCase())}${Color.zeroPad(this._.blue.toString(16).toUpperCase())}`
	}
}

class Polimot {

	static easing = {
		linear: t => t,
		inQuad: t => t * t,
		outQuad: t => t * (2 - t),
		inOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
		inCubic: t => t * t * t,
		outCubic: t => (--t) * t * t + 1,
		inOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
		inQuart(t) { return t * t * t * t; },
		outQuart(t) { return 1 - (--t) * t * t * t; },
		inOutQuart(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
		inQuint(t) { return t * t * t * t * t; },
		outQuint(t) { return 1 + (--t) * t * t * t * t; },
		inOutQuint(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
		inSine(t) { return -1 * Math.cos(t / 1 * (Math.PI * 0.5)) + 1; },
		outSine(t) { return Math.sin(t / 1 * (Math.PI * 0.5)); },
		inOutSine(t) { return -1 / 2 * (Math.cos(Math.PI * t) - 1); },
		inExpo(t) { return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)); },
		outExpo(t) { return (t == 1) ? 1 : (-Math.pow(2, -10 * t) + 1); },
		inOutExpo(t) {
			if (t == 0) return 0
			if (t == 1) return 1
			if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1))
			return 1 / 2 * (-Math.pow(2, -10 * --t) + 2)
		},
		inCirc(t) { return -1 * (Math.sqrt(1 - t * t) - 1); },
		outCirc(t) { return Math.sqrt(1 - (t = t - 1) * t); },
		inOutCirc(t) {
			if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1)
			return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1)
		},
		outElastic(t) {
			var s = 1.70158
			var p = 0
			var a = 1
			if (t == 0) return 0
			if (t == 1) return 1
			if (!p) p = 0.3
			if (a < 1) {
				a = 1
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a)
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p))
		},
		inElastic(t) {
			var s = 1.70158
			var p = 0
			var a = 1
			if (t == 0) return 0
			if (t == 1) return 1
			if (!p) p = 0.3
			if (a < 1) {
				a = 1
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a)
			return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1
		},
		inOutElastic(t) {
			var s = 1.70158
			var p = 0
			var a = 1
			if (t == 0) return 0
			if ((t /= 1 / 2) == 2) return 1
			if (!p) p = (0.3 * 1.5)
			if (a < 1) {
				a = 1
				var s = p / 4
			} else var s = p / (2 * Math.PI) * Math.asin(1 / a)
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p))
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1
		},
		inBack(t, s) {
			if (s == undefined) s = 1.70158
			return 1 * t * t * ((s + 1) * t - s)
		},
		outBack(t, s) {
			if (s == undefined) s = 1.70158
			return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1)
		},
		inOutBack(t, s) {
			if (s == undefined) s = 1.70158
			if ((t /= 1 / 2) < 1) return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s))
			return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2)
		},
		outBounce(t) { return 1 - this.inBounce(1 - t); },
		inBounce(t) {
			if ((t /= 1) < (1 / 2.75)) {
				return (7.5625 * t * t)
			} else if (t < (2 / 2.75)) {
				return (7.5625 * (t -= (1.5 / 2.75)) * t + .75)
			} else if (t < (2.5 / 2.75)) {
				return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375)
			} else {
				return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375)
			}
		},
		inOutBounce(t) {
			if (t < 1 / 2) return this.inBounce(t * 2) * 0.5
			return this.outBounce(t * 2 - 1) * 0.5 + 0.5
		},
		cubicBezier(mX1, mY1, mX2, mY2) {
			/*
			 * https://github.com/gre/bezier-easing
			 * BezierEasing - use bezier curve for transition easing function
			 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
			 */

			// These values are established by empiricism with tests (tradeoff: performance VS precision)
			var NEWTON_ITERATIONS = 4
			var NEWTON_MIN_SLOPE = 0.001
			var SUBDIVISION_PRECISION = 0.0000001
			var SUBDIVISION_MAX_ITERATIONS = 10

			var kSplineTableSize = 11
			var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)

			var float32ArraySupported = typeof Float32Array === 'function'

			function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
			function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
			function C(aA1) { return 3.0 * aA1; }

			// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
			function calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

			// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
			function getSlope(aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

			function binarySubdivide(aX, aA, aB, mX1, mX2) {
				var currentX, currentT, i = 0
				do {
					currentT = aA + (aB - aA) / 2.0
					currentX = calcBezier(currentT, mX1, mX2) - aX
					if (currentX > 0.0) {
						aB = currentT
					} else {
						aA = currentT
					}
				} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
				return currentT
			}

			function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
				for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
					var currentSlope = getSlope(aGuessT, mX1, mX2)
					if (currentSlope === 0.0) {
						return aGuessT
					}
					var currentX = calcBezier(aGuessT, mX1, mX2) - aX
					aGuessT -= currentX / currentSlope
				}
				return aGuessT
			}

			function LinearEasing(x) {
				return x
			}

			/* Esta función regresa una nueva función */
			function bezier(mX1, mY1, mX2, mY2) {
				if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
					throw new Error('bezier x values must be in [0, 1] range + ')
				}

				if (mX1 === mY1 && mX2 === mY2) {
					return LinearEasing
				}

				// Precompute samples table
				var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize)
				for (var i = 0; i < kSplineTableSize; ++i) {
					sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
				}

				function getTForX(aX) {
					var intervalStart = 0.0
					var currentSample = 1
					var lastSample = kSplineTableSize - 1

					for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
						intervalStart += kSampleStepSize
					}
					--currentSample

					// Interpolate to provide an initial guess for t
					var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample])
					var guessForT = intervalStart + dist * kSampleStepSize

					var initialSlope = getSlope(guessForT, mX1, mX2)
					if (initialSlope >= NEWTON_MIN_SLOPE) {
						return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
					} else if (initialSlope === 0.0) {
						return guessForT
					} else {
						return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2)
					}
				}

				return function BezierEasing(x) {
					// Because JavaScript number are imprecise, we should guarantee the extremes are right.
					if (x === 0) {
						return 0
					}
					if (x === 1) {
						return 1
					}
					return calcBezier(getTForX(x), mY1, mY2)
				}
			}

			return bezier(mX1, mY1, mX2, mY2)
		}
	}

	/* Duration */
	get duration() {
		return this._.duration
	}

	/* Determina con qué rapidez se ejecutará la animación. El valor de 0 detendrá la animación e impedirá que se vuelva a ejecutar. */
	get speed() {
		return this._.speed
	}

	set speed(value) {
		value = Number(value)
		if (value && value > 0) {
			this._.speed = value
		} else {
			this._.speed = 0
			this.pause()
		}
	}

	/* Direction */
	set direction(value) {
		if (typeof value !== 'string' || value.toLowerCase() === this._.direction) return
		let isPlaying = this._.status === 'playing'
		if (isPlaying) this.pause()
		this._.direction = value === 'reverse' ? 'reverse' : 'normal'
		this._.resetTimelines()
		this._.setFrame(this._.currentTime)
		if (isPlaying) this.play()
	}

	get direction() {
		return this._.direction
	}

	/* Current Time */
	set currentTime(value) {
		let isPlaying = this._.status === 'playing'
		if (isPlaying) this.pause()
		value = Number(value)
		if (isNaN(value)) {
			value = 0
		} else {
			value = Math.max(Math.min(value, this.duration), 0)
		}
		this._.currentTime = value
		this._.resetTimelines()
		this._.setFrame(value)
		if (isPlaying) this.play(this._.countingLoop)
	}

	get currentTime() {
		return this._.currentTime
	}

	/* Status */
	get status() {
		return this._.status
	}

	/* Loop */
	set loop(value) {
		value = Number(value)
		if (isNaN(value)) value = 0
		this._.loop = value
	}

	get loop() {
		return this._.loop
	}

	constructor(...timelines) {
		this._ = {
			timelines: [],
			status: 'pause',
			direction: 'normal',
			currentTime: 0,
			duration: 0,
			loop: 0,
			countingLoop: 0,
			speed: 1
		}

		/* Identifica los target dentro de un timeline, esta función es recursiva, debido a que el target puede ser un arreglo lo que hará necesario iterar en él. */
		this._.detectTarget = function (source, checkArray = true) {
			let target = []
			switch (typeof source) {
				case 'string':
					target = document.querySelectorAll(source)
					break
				case 'object':
					if (source.constructor.name === 'Array') {
						source.forEach(function (element, idx) {
							let tmpTargets = this._.detectTarget(element, false)
							tmpTargets.forEach(function (tmpTarget, idxTmpTarget) {
								if (tmpTarget) target.push(tmpTarget)
							})
						}.bind(this))
					} else if (source.constructor.name.search(/^HTML|SVG[a-zA-Z]*Element$/) > -1) {
						target.push(source)
					} else if (source !== null) {
						target.push(source)
					}
					break
				default:
					target.push(source)
					break
			}
			return target
		}.bind(this)

		/* Obtiene el actual valor de terminada propiedad del objetivo entregado como parámetro */
		this._.getCurrentValue = function (target, definitionType, name) {
			let value
			switch (definitionType) {
				case 'attrs':
					if (typeof target.getAttribute === 'function') {
						value = Number(target.getAttribute(name))
						if (isNaN(value)) value = 0
					}
					break
				case 'props':
					if (target[name]) {
						value = Number(target[name])
						if (isNaN(value)) value = 0
					}
					break
				case 'style':
					if (target.constructor.name.search(/^HTML|SVG[a-zA-Z]*Element$/) > -1) {
						let styles = getComputedStyle(target)
						if (styles[name]) {
							value = Number(styles[name].match(/^[+-]?[0-9]*\.?[0-9]+/g)[0])
							if (isNaN(value)) value = 0
						}
					}
					break
			}
			return value || 0
		}

		this._.detectEasing = function (easing, saveMode = true) {
			if (easing) {
				switch (typeof easing) {
					case 'string':
						if (this.constructor.easing[easing]) {
							return this.constructor.easing[easing]
						} else {
							return this.constructor.easing.linear
						}
					case 'function':
						break
					case 'object':
						if (easing === null) {
							return this.constructor.easing.linear
						} else if (easing.constructor.name === 'Array') {
							return this.constructor.easing.cubicBezier(...easing)
						}
						break
					default:
						return this.constructor.easing.linear
				}
			} else {
				if (saveMode) return this.constructor.easing.linear
			}
		}.bind(this)

		this._.decodeStringValue = function (value, definitionTemplate, definitionType, target, name, completeValues = false, valueBefore) {
			if (value.search(/^#[A-Fa-f0-9]{6}$/) > -1) {
				if (definitionTemplate.isColor === false) return
				if (definitionTemplate.isColor === undefined) definitionTemplate.isColor = true
				definitionTemplate.values.push(new Color(value))
			} if (value.search(/^[+-]=[+-]?[0-9]*\.?[0-9]+$/) > -1) {
				let sign = value[0] === '+' ? 1 : -1
				let currentValue = this._.getCurrentValue(target, definitionType, name)
				if (definitionTemplate.values.length === 0) {
					definitionTemplate.values = [currentValue]
				}
				if (completeValues) {
					definitionTemplate.result = (n) => n
				}
				definitionTemplate.values.push((typeof valueBefore === 'undefined' ? currentValue : valueBefore)
					+ Number(value.match(/[+-]?[0-9]*\.?[0-9]+/g)[0]) * sign)
			} else {
				definitionTemplate.result = (n) => value.replace(/\?/g, n)
				if (completeValues) definitionTemplate.values = [0, 1]
			}
		}.bind(this)

		this._.detectDefinition = function (definition, definitionType, target, name) {
			if (!definition) return
			let definitionTemplate = null
			switch (typeof definition) {
				case 'number':
					definitionTemplate = {
						values: [],
						isColor: undefined,
						easing: null,
						result: (n) => n
					}
					let value = this._.getCurrentValue(target, definitionType, name)
					definitionTemplate.values = [value, definition]
					break
				case 'object':
					if (definition === null) break
					if (definition.constructor.name === 'Array') {
						definitionTemplate = {
							values: [],
							isColor: undefined,
							easing: null,
							result: (n) => n
						}
						definition.forEach(function (value, idxValue) {
							switch (typeof value) {
								case 'number':
									if (definitionTemplate.isColor === true) return
									if (definitionTemplate.isColor === undefined) definitionTemplate.isColor = false
									definitionTemplate.values.push(value)
									break
								case 'string':
									this._.decodeStringValue(value, definitionTemplate, definitionType, target, name, false, definitionTemplate.values[definitionTemplate.values.length - 1])
									break
								case 'function':
									definitionTemplate.values = [0, 1]
									definitionTemplate.isColor = false
									definitionTemplate.result = value
									break
								default:
									break
							}
						}.bind(this))
						/* Si hay sólo un elemento en values, se inserta el valor que el objetivo tenga actualmente */
						if (definitionTemplate.values.length === 1) {
							definitionTemplate.values.unshift(this._.getCurrentValue(target, definitionType, name))
						}
					} else {
						definitionTemplate = {
							values: definition.values || [0, 1],
							isColor: false,
							easing: this._.detectEasing(definition.easing, true),
							result: definition.result || ((n) => n)
						}
						if (definitionTemplate.values.constructor.name === 'Array') {
							let tmpDefinitionTemplate = this._.detectDefinition(definitionTemplate.values, definitionType, target, name)
							definitionTemplate.values = tmpDefinitionTemplate.values
							definitionTemplate.isColor = tmpDefinitionTemplate.isColor
							if (tmpDefinitionTemplate.result) definitionTemplate.result = tmpDefinitionTemplate.result
						}
					}
					break
				case 'function':
					definitionTemplate = {
						values: [0, 1],
						result: definition
					}
					break
				case 'string':
					definitionTemplate = {
						values: []
					}
					this._.decodeStringValue(definition, definitionTemplate, definitionType, target, name, true, undefined)
					break
				default:
					return
			}
			if (!definitionTemplate.easing) definitionTemplate.easing = this._.detectEasing(definitionTemplate.easing, false)
			return definitionTemplate
		}.bind(this)

		this._.makeTimeline = (timeline, idxTimeline, reference) => {
			/* Valida que tenga definida la propiedad target. */
			if (!timeline.target) {
				console.log('El timeline ' + idxTimeline + ' no tiene definido correctamente la propiedad "target".')
				return
			}
			let targets = this._.detectTarget(timeline.target, idxTimeline)
			if (targets.length === 0) {
				console.log('No se pudo detectar ningún elemento como "target" para en el timeline ' + idxTimeline + '.')
				return
			}

			/* Si la propiedad easing es un array, se compila para obtener la función cubicBezier correspondiente */
			let easing = this._.detectEasing(timeline.easing)

			let timelines = []

			/* Detecta el tiempo de inicio */
			let startTime = Number(timeline.startTime)
			if (isNaN(startTime)) startTime = reference.markTime

			targets.forEach(function (target, idxTarget) {
				let stagger = timeline.stagger || 0
				let delay = timeline.delay || 0
				let timelineTemplate = {
					target: target,
					startTime: startTime + delay + stagger * idxTarget,
					duration: (timeline.duration || 1000),
					easing: easing,
					begin: timeline.begin || null,
					update: timeline.update || null,
					complete: timeline.complete || null,
					attrs: timeline.attrs ? { ...timeline.attrs } : null,
					props: timeline.props ? { ...timeline.props } : null,
					style: timeline.style ? { ...timeline.style } : null,
					steps: Number(timeline.steps) || 0,
				}
				timelineTemplate.endTime = timelineTemplate.startTime + timelineTemplate.duration
				this._.duration = Math.max(this._.duration, timelineTemplate.endTime)

				/* Compila las definiciones */
				Polimot.definitionTypes.forEach(function (definitionType, idxDefinitionType) {
					for (let name in timelineTemplate[definitionType]) {
						timelineTemplate[definitionType][name] = this._.detectDefinition(timelineTemplate[definitionType][name], definitionType, target, name)
					}
				}.bind(this))

				timelines.push(timelineTemplate)
			}.bind(this))

			/* Actualiza la marca de tiempo */
			reference.markTime = timelines[timelines.length - 1].endTime

			return timelines
		}

		/* Compila el motor obteniendo los timeline resultantes. */
		this._.compile = function () {
			if (this._.status === 'pause') this.pause()
			let reference = {
				markTime: 0
			}
			timelines.forEach((timeline, idxTimeline) => {
				let neoTimeline = this._.makeTimeline(timeline, idxTimeline, reference)
				if (neoTimeline !== null) this._.timelines = this._.timelines.concat(neoTimeline)
			})
		}.bind(this)

		/* Dibuja el frame estableciendo todas las propiedades de los targets */
		this._.drawFrame = function (subTime, timeline) {
			let percentTime = subTime / timeline.duration
			let transformDefinitions = []
			let clipPathDefinitions = []
			/* Identifica las definiciones */
			Polimot.definitionTypes.forEach(function (definitionType, idxDefinitionType) {
				let groupDefinitions = timeline[definitionType]
				if (!groupDefinitions) return
				for (let definitionName in groupDefinitions) {
					let definition = groupDefinitions[definitionName]
					/* Altera el valor de percentTime en caso se haya definido la propiedad steps */
					if (timeline.steps > 0) {
						let partTime = timeline.duration / (timeline.steps + 1)
						percentTime = Math.floor(percentTime * timeline.duration / partTime) * partTime / timeline.duration
					}
					/* Define el porcentaje de acuerdo al easing */
					let easing = definition.easing || timeline.easing
					let percent = easing(percentTime)
					/* Define la variación */
					let delta = 1 / (definition.values.length - 1)
					/* Obtiene los índices de los valores claves */
					let prevIndex = Math.floor(percentTime * (definition.values.length - 1))
					if (prevIndex === definition.values.length - 1) prevIndex = definition.values.length - 2
					let nextIndex = prevIndex + 1
					/* Obtiene los valores */
					let prevValue = definition.values[prevIndex]
					let nextValue = definition.values[nextIndex]
					/* Obtiene el valor según la proporción del subTime */
					let valueToProcess
					let finalValue
					if (definition.isColor) {
						finalValue = Color.change(prevValue, nextValue, function (prevValue, nextValue) {
							let valueToProcess = (percent - delta * prevIndex) * (definition.values.length - 1) * (nextValue - prevValue) + prevValue
							return definition.result(valueToProcess)
						}).toString()
					} else {
						valueToProcess = (percent - delta * prevIndex) * (definition.values.length - 1) * (nextValue - prevValue) + prevValue
						finalValue = definition.result(valueToProcess)
					}
					/* Obtiene el valor final según lo calculado con la función result */
					switch (definitionType) {
						case 'attrs':
							timeline.target.setAttribute(definitionName, finalValue)
							break
						case 'props':
							timeline.target[definitionName] = finalValue
							break
						case 'style':
							if (Polimot.transformFunctions.indexOf(definitionName) > -1) {
								/* Las propiedades de tipo transform se aplican al target al final, primero se agregan a un array. */
								transformDefinitions.push(`${definitionName}(${finalValue})`)
							} else if (Polimot.clipPathFunctions.indexOf(definitionName) > -1) {
								/* Las propiedades de tipo transform se aplican al target al final, primero se agregan a un array. */
								clipPathDefinitions.push(`${definitionName}(${finalValue})`)
							} else {
								timeline.target.style[definitionName] = finalValue
							}
							break
					}
				}
			})
			if (transformDefinitions.length > 0) timeline.target.style.transform = transformDefinitions.join(' ')
			if (clipPathDefinitions.length > 0) timeline.target.style.clipPath = clipPathDefinitions.join(' ')
		}

		/* Itera en todos los timeline para dibujar sus respectivos frames. */
		this._.setFrame = function (mainTime) {
			this._.timelines.forEach(function (timeline, idxTimeline) {
				let subTime
				let toExecute = []
				let param = {
					target: timeline.target,
					mainTime: mainTime,
					direction: this._.direction
				}
				/* Identifica en qué posición se encuentra el cabezal en la animación y determina si dibujar o no todos los timeline */
				if (this._.direction !== 'reverse') {
					if (timeline.startTime > mainTime && this._.status !== 'playing') {
						subTime = 0
						param.subTime = subTime
					} else if (timeline.endTime <= mainTime && (!timeline.terminated || this._.status !== 'playing')) {
						subTime = timeline.duration
						param.subTime = subTime
						if (this._.status === 'playing' && typeof timeline.complete === 'function') toExecute.push(timeline.complete)
						timeline.terminated = true
						timeline.started = true
					}
				} else {
					if (timeline.endTime < mainTime && this._.status !== 'playing') {
						subTime = timeline.duration
						param.subTime = subTime
					} else if (timeline.startTime >= mainTime && (!timeline.terminated || this._.status !== 'playing')) {
						subTime = 0
						param.subTime = subTime
						if (this._.status === 'playing' && typeof timeline.begin === 'function') toExecute.push(timeline.begin)
						timeline.terminated = true
						timeline.started = true
					}
				}
				if (timeline.startTime <= mainTime && timeline.endTime >= mainTime) {
					subTime = mainTime - timeline.startTime
					param.subTime = subTime
					if (this._.status === 'playing') {
						if (!timeline.started) {
							if (this._.direction !== 'reverse' && typeof timeline.begin === 'function') {
								toExecute.push(timeline.begin)
							} else if (this._.direction === 'reverse' && typeof timeline.complete === 'function') {
								toExecute.push(timeline.complete)
							}
						}
						if (typeof timeline.update === 'function') toExecute.push(timeline.update)
						timeline.started = true
					}
				}
				/* Si se ha logrado identificar el tiempo dentro del timeline, se dibuja el frame del timeline. */
				if (subTime !== undefined) this._.drawFrame(subTime, timeline)
				toExecute.forEach(function (toDo) {
					toDo(param)
				})
			}.bind(this))
		}.bind(this)

		this._.resetTimelines = function () {
			this._.timelines.forEach(function (timeline, idxTimeline) {
				timeline.terminated = false
				timeline.started = false
			})
		}.bind(this)

		this._.compile()
	}

	play(startLoop = 0) {
		if (!this._.duration || !this._.speed) return
		if (this._.status === 'pause') {
			if (this._.currentTime === this._.duration && this._.direction !== 'reverse') {
				this._.countingLoop = startLoop
				this.currentTime = 0
			} else if (this._.currentTime === 0 && this._.direction === 'reverse') {
				this._.countingLoop = startLoop
				this.currentTime = this._.duration
			} else if (this._.currentTime === 0 && this._.direction !== 'reverse') {
				this.currentTime = 0
			} else if (this._.currentTime === this._.duration && this._.direction === 'reverse') {
				this.currentTime = this._.duration
			}
			this._.status = 'playing'
		} else {
			return
		}
		let start = performance.now() - this._.currentTime * (this._.direction === 'reverse' ? -1 : 1)
		let animate = function (time) {
			let currentTime = this._.direction === 'reverse' ? Math.max(Math.min(this._.speed * (start - time), this._.duration), 0) :
				Math.min(Math.max(this._.speed * (time - start), 0), this._.duration)
			this._.setFrame(currentTime)
			/* Si el mainTime se desborda de la duración de la animación total, se detiene la animación */
			if ((currentTime >= this._.duration && this._.direction !== 'reverse') || (currentTime <= 0 && this._.direction === 'reverse')) {
				if (this._.loop > 0 && this._.countingLoop < this._.loop) {
					this._.resetTimelines()
					if (this._.loop < Infinity) this._.countingLoop++
					this._.currentTime = currentTime >= this._.duration ? 0 : this._.duration
					start = performance.now() - this._.currentTime * (this._.direction === 'reverse' ? -1 : 1)
				} else {
					this._.countingLoop = 0
					this._.status = 'pause'
				}
			}
			this._.currentTime = currentTime
			/* Si aún sigue la animación, se invoca a un nuevo frame. */
			if (this._.status === 'playing') this._.requestAnimationFrameID = requestAnimationFrame(animate)
		}.bind(this)
		this._.requestAnimationFrameID = requestAnimationFrame(animate)
	}

	pause() {
		if (this._.requestAnimationFrameID) cancelAnimationFrame(this._.requestAnimationFrameID)
		if (this._.status === 'playing') this._.status = 'pause'
	}

	restart() {
		this.pause()
		if (this._.direction === 'reverse') {
			this.currentTime = this.duration
		} else {
			this.currentTime = 0
		}
	}

	add(...timelines) {
		this._.timelines = this._.timelines.concat(timelines)
		this._.compile()
	}

}

/* Crea nuevas funciones en base a cubic-bezier */
Polimot.easing.softInElastic = Polimot.easing.cubicBezier(.08, 1.07, .55, 1.26)
Polimot.easing.softOutElastic = Polimot.easing.cubicBezier(.45, -0.26, .8, -0.07)

Polimot.definitionTypes = ['attrs', 'props', 'style']
Polimot.transformFunctions = ['matrix', 'translate', 'translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'skew', 'skewX', 'skewY', 'matrix3D', 'translate3D', 'translateZ', 'scale3d',
	'scaleZ', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'perspective']
Polimot.clipPathFunctions = ['inset', 'circle', 'polygon']