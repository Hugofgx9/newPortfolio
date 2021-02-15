export default class splitText {
	constructor (opt = {}) {
		this.options = opt;
		this.element = document.querySelector(this.options.target);
		this.defaultContent = this.element.innerHTML;

		if (this.options.split) {
			let splitOpts = this.options.split.split(',');
			splitOpts.includes('chars') && this.separateChars();
			splitOpts.includes('lines') && this.createLines();

		}
		else {
			this.createLines();
			this.separateChars();			
		}

		if (this.options.hide) {
			let hideOpts = this.options.hide.split(',');
			hideOpts.includes('chars') && this.hideElements('[data-split=char-wrapper]');
			hideOpts.includes('lines') && this.hideElements('[data-split=line-wrapper]');
		}
	}

	createDiv (text) {

		//turn to div
		let div = document.createElement('div');
		div.style.display = "inline";
		//div.style.whiteSpace = "normal";
		div.innerText = text;
		return div;
	}

	separateChars() {
		let cloneNode = this.element.cloneNode(true);
		cloneNode.innerHTML = '';

		const ElementToDivs = (element, cloneWrapper) => {
			cloneWrapper.innerHTML = '';

			for (let child of element.childNodes ) {

				if (child.nodeType == 3) {
					let splittedText = child.textContent.split('');

					splittedText.forEach(char => {
						let divWrapper = this.createDiv('');
						divWrapper.setAttribute('data-split', 'char-wrapper');
						divWrapper.style.display = 'inline-block';
						let div = this.createDiv(char);
						div.setAttribute('data-split', 'char');
						div.style.display = 'inline-block';
						div.style.whiteSpace = 'pre-wrap';

						divWrapper.appendChild(div)

						//ne prend pas en compte les espaces
						//span.style.display = 'inline-block';
						cloneWrapper.appendChild(divWrapper);
					})
				} 
				//if child est un node
				else if (child.nodeType !== 3) {
					cloneWrapper.appendChild(child.cloneNode(true));

					//if child has child element
					if (child.firstChild) {
						//reccursive
						ElementToDivs(child, cloneWrapper.lastChild);
					}
				}
			}
		}


		ElementToDivs(this.element, cloneNode);
		this.element.parentElement.replaceChild(cloneNode, this.element);
		this.element = cloneNode;

	}

	createLines() {

		let cloneNode = this.element.cloneNode(true);
		cloneNode.innerHTML = '';

		let top = -1;
		let currentLine;
		let lineWrapper;

		const ElementToLines = () => {
			//remplace les nodes text par des node pour pouvoir accéder à leur hauteur
			for (let child of this.element.childNodes) {

				if (child.nodeType == 3) {
					let div = this.createDiv(child.textContent);
					this.element.replaceChild(div, child);
				}
			}

			for (let child of this.element.childNodes) {
				//child is not a br
				if (child.tagName !== 'BR') {
					let tolerance = child.offsetHeight / 5;

					//if different is different line
					//create a new one and add it to array and nodeClone
					//maybe change it by calculate the center 
					if (child.offsetTop - tolerance > top) {

						top = child.offsetTop;
						currentLine = this.createDiv('');
						currentLine.setAttribute('data-split', 'line');
						currentLine.style.display = "inline-block";

						lineWrapper = this.createDiv('');
						lineWrapper.setAttribute('data-split', 'line-wrapper');
						lineWrapper.style.display = "block";

						cloneNode.appendChild(lineWrapper);
						lineWrapper.appendChild(currentLine);
					}
					currentLine.appendChild(child.cloneNode(true));
				}
			}		
		} 

		ElementToLines();

		this.element.parentElement.replaceChild(cloneNode,this.element);
		this.element = cloneNode;
	}

	// overflow = 'hidden';
	hideElements(selector) {
		let elements = this.element.querySelectorAll(selector);

		for (let element of elements) {
			element.style.overflow = 'hidden';
		}
	}

	reverse() {
		this.element.innerHTML = this.defaultContent;
	}

	getChars() {
		return this.element.querySelectorAll(`[data-split="char"]`);
	}

	getLines() {
		return this.element.querySelectorAll(`[data-split="line"]`);
	}

	getElement() {
		return document.querySelector(this.options.target);
	}
}



