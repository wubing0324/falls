window.onload = function() {
	waterfall('main', 'box');
	var height = document.body.clientHeight || document.documentElement.clientHeight;
	fullPage(height);
	setTimeout(function() {
		waterfall('main', 'box');
	}, 100)
	window.onscroll = function() {
		if(checkScrollSlide()) {
			imgAppend();
			waterfall('main', 'box');
		}
	}
	window.onresize = function() {
		waterfall('main', 'box');
	}
}

//获取parent下所有box元素，进行样式设置和布局
function waterfall(parent, box) {
	var oParent = document.getElementById(parent);
	var oBoxs = getByClass(oParent, box);
	var oBoxW = oBoxs[0].offsetWidth;
	var bodyWidth = document.documentElement.clientWidth || document.body.clientWidth;
	var cols = Math.floor(bodyWidth / oBoxW); //获取当前页面下box元素总列数
	oParent.style.cssText = 'width:' + oBoxW * cols + 'px;margin:0 auto'; //根据子元素box列数和宽度设置parent宽度并居中
	var hArr = []; //用于存储每一列的总高度，查询最小高度并在最小高度所在列追加一个新的box元素
	for(var i = 0; i < oBoxs.length; i++) { //遍历所有box元素，
		if(i < cols) { //初始化每一列的高度，值为box[0]-box[cols-1]的值，并且过滤掉box[0]-box[cols-1]，不改变其样式，
			//例如，页面共有五列，那么box元素的前五个元素采用默认布局，第六个元素开始定位。cols=5，i<cols，走if，大于5的才修改样式。
			hArr.push(oBoxs[i].offsetHeight);
			oBoxs[i].style.position = 'static';
		} else { //改变box[cols]以及以后所有box的布局，依次追加到最小列数的下面
			var minH = Math.min.apply(null, hArr);
			var index = getMinhIndex(hArr, minH);
			oBoxs[i].style.position = 'absolute';
			oBoxs[i].style.top = hArr[index] + 'px';
			oBoxs[i].style.left = index * oBoxW + 'px';
			hArr[index] += oBoxs[i].offsetHeight; //追加元素后，重新获得当前列的高度，下次循环查找最小列数并追加。
		}
	}
}

//查询并获得parent下所有className，以数组形式返回
function getByClass(parent, className) {
	//	var box = parent.getElementsByClassName(className);IE浏览器不兼容document.getElementsByClassName()方法，只兼容TagName和Id
	var boxArr = [],
		oElements = parent.getElementsByTagName("*"); //*取到的是parent下所有的子元素，包括直接子元素和后代子元素
	for(var i = 0; i < oElements.length; i++) {
		if(oElements[i].className == className) {
			boxArr.push(oElements[i]);
		}
	}
	return boxArr;
}

//获取数组中最小值的索引
function getMinhIndex(arr, key) {
	for(var i in arr) {
		if(arr[i] == key) {
			return i;
		}
	}
}

//检测最后一个box元素是否出现在当前浏览器窗口中，若出现，则向后追加元素，因为最后一个box下面什么都没有，不能让用户看到空页面吧
function checkScrollSlide() {
	var oParent = document.getElementById('main');
	var oBoxs = getByClass(oParent, 'box');
	var lastBoxH = oBoxs[oBoxs.length - 1].offsetTop + Math.floor(oBoxs[oBoxs.length - 1].offsetHeight / 2);
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.body.clientHeight || document.documentElement.clientHeight;
	return(lastBoxH < scrollTop + height) ? true : false;
}

//向oParent下追加box子元素
function imgAppend() {
	var oParent = document.getElementById('main');
	//jQuery的ajax方法
	//		$.ajax({
	//			'type': "get",
	//			'url': "json/data.json",
	//			'async': true,
	//			'dataType': "json",
	//			success: function(dataInt) {
	//				for(var i = 0; i < dataInt.data.length; i++) {
	//					var oBox = document.createElement('div');
	//					oBox.className = 'box';
	//					oParent.appendChild(oBox);
	//					var oPIc = document.createElement('div');
	//					oPIc.className = 'pic';
	//					oBox.appendChild(oPIc);
	//					var oImg = document.createElement('img');
	//					oImg.src = 'img/' + dataInt.data[i].src;
	//					oPIc.appendChild(oImg);
	//				}
	//				waterfall('main', 'box');
	//			}
	//		});

	//js的ajax方法
	//获取XMLHttpRequest对象
	var xhr = getXhr();
	var url = location.href.replace("index.html", "json/data.json");
	xhr.open("get", url);

	xhr.send(null);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				var dataInt = JSON.parse(xhr.responseText);
				//console.log(dataInt.data[0].src);
				for(var i = 0; i < dataInt.data.length; i++) {
					var oBox = document.createElement('div');
					oBox.className = 'box';
					oParent.appendChild(oBox);
					var oPIc = document.createElement('div');
					oPIc.className = 'pic';
					oBox.appendChild(oPIc);
					var oImg = document.createElement('img');
					oImg.src = 'img/' + dataInt.data[i].src;
					oPIc.appendChild(oImg);
				}
				waterfall('main', 'box');
			}
		}
	}

}

//判断box元素是否满屏，没有就追加box元素直到占满整个屏幕，因为如果不占满整个屏幕，就没办法向下滚动屏幕。
function fullPage(height) {
	var oParent = document.getElementById('main');
	var arr = getByClass(oParent, 'box');
	var lastTop = arr[arr.length - 1].offsetTop + arr[arr.length - 1].offsetHeight;
	if(lastTop > height) {
		return -1;
	} else {
		imgAppend();
		setTimeout(function() {
			fullPage(height);
		}, 50);
	}
}

//创实例化MLHttpRequest对象
function getXhr() {
	var xhr = null;
	if(window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		xhr = new ActiveXObject("Microsoft.XMLhttp");
	}
	return xhr;
}