function staticValueTypeConstructor(t, value) {
	if (!Array.isArray(value)) {
		// this is a leaf, return value
		return value
	}
	if (typeof value[0] === 'string') {
		// this is a constructable value of type ['SomeType', valueA, valueB]
		const [type, ...values] = value
		const args = values.map(item => staticValueTypeConstructor(t, item))
		return t[type](...args)
	} else {
		// this is an array of values of type [['SomeType', value], ['SomeType', value]]
		return value.map(item => staticValueTypeConstructor(t, item))
	}
}

function isNodeStaticValue(arg) {
	if (!arg) {
		return ['EmptyStatement']
	}
	if (['NumericLiteral', 'BooleanLiteral', 'StringLiteral'].includes(arg.type)) {
		return [arg.type, arg.value]
	}
	if (arg.type === "TemplateLiteral") {
		if (arg.expressions.length !== 0) {
			return false
		}
		if (arg.quasis.length === 0) {
			return ['StringLiteral', '']
		}
		return ['StringLiteral', arg.quasis[0].value.cooked]
	}
	if (arg.type === 'NullLiteral') {
		return ['Identifier', 'null']
	}
	if (arg.type === 'Identifier') {
		if (['undefined', 'NaN', 'Infinity'].includes(arg.name)) {
			return ['Identifier', arg.name]
		}
		return false
	}
	if (arg.type === 'ObjectExpression') {
		const properties = []
		for(let i = 0; i < arg.properties.length; i++) {
			const value = isNodeStaticValue(arg.properties[i].value)
			if(!value) {
				return false
			}
			const key = arg.properties[i].key.name || arg.properties[i].key.value
			properties.push(['ObjectProperty', ['StringLiteral', key], value])
		}
		return ['ObjectExpression', properties]
	}
	if (arg.type === 'ArrayExpression') {
		const elements = []
		for(let i = 0; i < arg.elements.length; i++) {
			const value = isNodeStaticValue(arg.elements[i])
			if(!value) {
				return false
			}
			elements.push(value)
		}
		return ['ArrayExpression', elements]
	}
	return false
}

module.exports = {
	isNodeStaticValue,
	staticValueTypeConstructor,
}