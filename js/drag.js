let oWrap = document.querySelector("#wrap");
let oDrag = document.querySelectorAll(".drag")[0];
let aImg = oDrag.getElementsByTagName("img");
let oWrapL = oWrap.offsetLeft;
let oWrapT = oWrap.offsetTop;
let oDragT = oWrap.children[0].offsetHeight;
let count = 0;
let arrImg = ["img/1.jpg", "img/2.jpg", "img/3.jpg", "img/4.jpg", "img/5.jpg", "img/6.jpg"];
let oRandom = document.querySelector(".aRandom");
oRandom.onclick = function() {
	ran();
}

//循环排列图片初始位置
for (let i = 0; i < Math.ceil(aImg.length / 4); i++) {
	for (let j = 0; j < 4; j++) {
		if (count >= aImg.length) {
			break;
		}
		aImg[count].style.left = ((aImg[count].offsetWidth + 10) * j + 10) + "px";
		aImg[count].style.top = ((aImg[count].offsetHeight + 10) * i + 10) + "px";
		count++;
	}
}

//勾股求距离最近的图片
function dis(domobj1, domobj2) {
	let x = domobj1.offsetLeft - domobj2.offsetLeft;
	let y = domobj1.offsetTop - domobj2.offsetTop;
	return Math.sqrt(x * x + y * y);
}


//判断是否碰撞到其他元素
function impact(domobj1, domobj2) {
	let L1 = domobj1.offsetLeft;
	let R1 = domobj1.offsetLeft + domobj1.offsetWidth;
	let T1 = domobj1.offsetTop;
	let B1 = domobj1.offsetTop + domobj1.offsetHeight;

	let L2 = domobj2.offsetLeft;
	let R2 = domobj2.offsetLeft + domobj2.offsetWidth;
	let T2 = domobj2.offsetTop;
	let B2 = domobj2.offsetTop + domobj2.offsetHeight;

	if (L2 > R1 || T2 > B1 || R2 < L1 || B2 < T1) {
		return false;
	} else {
		return true;
	}
}

//返回离得最近且碰撞到的元素，如果没有在另一张图片的范围上时就返回本身
function near(domobj) {
	let tmp = 600;
	var nImg = domobj;
	for (let i = 0; i < aImg.length; i++) {
		if (impact(domobj, aImg[i]) && domobj != aImg[i]) {
			let c = dis(domobj, aImg[i]);
			if (tmp > c) {
				tmp = c;
				nImg = aImg[i];
			}
		}
	}
	return nImg;
}

//随机图片排序
function ran() {
	let ranPos = [];
	let r = Math.floor(Math.random() * 6);
	for (let i = 0; i < arrImg.length; i++) {
		if (ranPos.indexOf(r) == -1) {
			ranPos[i] = r;
		} else {
			while (ranPos.indexOf(r) != -1) {
				r = Math.floor(Math.random() * 6);
			}
			ranPos[i] = r;
		}
	}

	for (let i = 0; i < arrImg.length; i++) {
		aImg[i].src = arrImg[ranPos[i]];
	}

}

//事件委托判断图片点击事件
oDrag.onmousedown = function(e) {
	let evt = e || event;
	let _target = evt.target || evt.srcElement;
	if (_target.nodeName.toLowerCase() == "img") {
		let ol = evt.offsetX;
		let ot = evt.offsetY;
		let firstL = _target.style.left;
		let firstT = _target.style.top;
		let nearest = near(_target);
		_target.style.zIndex = 1; //将点击的图片层级调高
		document.onmousemove = function(e) {
			let evt = e || event;
			let imgL = evt.pageX - ol - oWrapL;
			let imgT = evt.pageY - oWrapT - oDragT - ot;
			_target.style.left = imgL + "px";
			_target.style.top = imgT + "px";

			nearest = near(_target); //获取距离最近且碰撞到的元素
			for (let i = 0; i < aImg.length; i++) {
				aImg[i].style.border = 0;
			}
			nearest.style.border = "dashed 2px #f00"; //将该元素边框样式改变

			return false;
		}

		document.onmouseup = function() {
			let templ = _target.style.left;
			let tempt = _target.style.top;
			_target.style.left = nearest.style.left;
			_target.style.top = nearest.style.top;
			nearest.style.left = firstL;
			nearest.style.top = firstT;

			for (let i = 0; i < aImg.length; i++) {
				aImg[i].style.border = 0;
			}
			_target.style.zIndex = 0;
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}
	return false;
}
