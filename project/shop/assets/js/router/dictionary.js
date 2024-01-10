//dictionary.js;
var list = [];
class dictionary {
	set(key, value) {
		list.push({
			key: key,
			value: value,
		})
	}
	get(key) {
		var component=null;
		list.forEach(item => {
			if (item.key == key){
				component=item.value;
			}
		})

		return component;
	}

// export default dictionary
}