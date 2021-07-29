---
title: 'jQuery Tutorial Resources'
date: '2015-06-13'
author: 'MangleKuo'
---

## 下载

点击[这里](../file/files/jquery-tutorial-resources.zip)来打包下载jQuery和基本使用范例HTML档案

**或者**

将两者分开下载：

+ [index.html](../file/files/jquery-tutorial-resources/index.html) _请使用右键→另存为 不要直接点开_
+ [jquery-1.11.3.min.js](../file/files/jquery-tutorial-resources/jquery-1.11.3.min.js) _1.11.3 是版本号，min代表把所有空格和换行去掉了以达到最小（minimum）的档案大小。_

请确保两者在同一目录下，且权限都设置为所有人读写。

## 测试

打开index.html，应该会见到测试成功的警告框

## 001javascript:万物皆物件

```javascript
//普通定义变量
var myVar = 100;

//普通定义函数
function myFunc(){
	// Do something
}

//其实可以...
var myFunc = function(){
	// Do something
};

//还可以
var myObj = {
	number : 0,
	addOne : function(){
		this.number = this.number + 1;
	}
};
console.log(myObj.number); //0
myObj.addOne(); 
console.log(myObj.number); //1

```

### 用jQuery测试最后一段代码

找到index.html，打开。  
应该长这样
```html
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>jQuery</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
    <style>
	    *{
	    	padding: 0;
	    	margin: 0;
	    }
	    body{
	    	margin: 0;
	    	padding: 0;
	    	width: 100%;
	    	height: 100%;
	    }
    </style>
</head>
<body>
	<!-- Your codes here -->


	<!-- Your codes here -->
    <script src="./jquery-1.11.3.min.js"></script>
    <script>
    	$(document).ready(function(){
    		alert("Hello! jQuery is running normally if you can see this!");
    	});
    </script>
</body>
</html>
```
进行下列修改：
```diff
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>jQuery</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
    <style>
	    *{
	    	padding: 0;
	    	margin: 0;
	    }
	    body{
	    	margin: 0;
	    	padding: 0;
	    	width: 100%;
	    	height: 100%;
	    }
+		#display{
+			font-size: 100px;
+			background-color: #eee;
+			text-align: center;
+		}
    </style>
</head>
<body>
	<!-- Your codes here -->
+		<div id="display"></div>
	<!-- Your codes here -->
    <script src="./jquery-1.11.3.min.js"></script>
    <script>
-    	$(document).ready(function(){
-    		alert("Hello! jQuery is running normally if you can see this!");
-    	});
+		var myObj = {
+			number : 0,
+			addOne : function(){
+				this.number = this.number + 1;
+			}
+		};
+
+		$("#display").html(myObj.number);
+		$("#display").click(function(){
+			myObj.addOne();
+			$("#display").html(myObj.number);
+		});
    </script>
</body>
</html>
```

(删掉红色 添加绿色)

你也可以通過
```
$("#display").html()來調用\#display裡的HTML
```

### 練習1

**將+1改成-1並相對於每次更新數字，把每次新的數字“黏”到之前現實的數字後面**

所以  
打開頁面 → 0
點擊一次 → 0－1
點擊兩次 → 0－1-2
點擊三次 → 0－1-2-3

答案：
```
		var myObj = {
			number : 0,
			addOne : function(){
				this.number = this.number - 1;
			}
		};

		$("#display").html(myObj.number);
		$("#display").click(function(){
			myObj.addOne();
			$("#display").html( $("#display").html() + myObj.number);
		});
```

### 練習2

**點擊#display後，#display的parent背景顏色變紅**

答案

```html
<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>jQuery</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
    <style>
	    *{
	    	padding: 0;
	    	margin: 0;
	    }
	    body{
	    	margin: 0;
	    	padding: 0;
	    	width: 100%;
	    	height: 100%;
	    }

		#display{
			font-size: 100px;
			background-color: #eee;
			text-align: center;
			margin: 20px;
		}
    </style>
</head>
<body>
	<!-- Your codes here -->
		<div>
			<div id="display">100</div>
		</div>
	<!-- Your codes here -->
    <script src="./jquery-1.11.3.min.js"></script>
	<script>

		$("#display").click(function(){
			// Change the background-color of parent to red
			$(this).parent().css("background-color","#f00");
		});

	</script>
</body>
</html>
```
