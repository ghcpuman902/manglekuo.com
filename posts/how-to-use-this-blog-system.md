---
title: 'How to use this blog system'
date: '2015-06-05'
author: 'MangleKuo'
---


**This article is written for [<i class="fa fa-github"></i> this](https://github.com/ghcpuman902/mangolb) GitHub project. If you want to learn more about the code, I suggest you go to the GitHub page instead of checking the Source Code of this page.**

## Before you start

1. This system is based on PHP. Make sure you have PHP up and running on your server/computer
2. In order to reduce the file size, I'm using CDN for jQuery and MathJax. The font Raleway is also hosted by Google Font online. Hence a good internet connection is required. You can host them yourself if you want.
3. If you have any question about this documentation, or you've seen some mistakes, please don't be hesitate to contact me by email: [ghcpuman902@gmail.com](mailto:ghcpuman902@gmail.com) or [other ways](http://manglekuo.com/#contact).



## File structure

The directory of this Blog system is like this:

```diff
| + mangolb/
|	| + index.php
|	| + articles/
|	|   | + default/
|	|   |   | + cover.jpg
|	|   |   | + img1.jpg
|	|   | + default.txt
|	|   | - article-1/
|	|   | + article-1.txt
|	|   | - article-2/
|	|   | + article-2.txt
|	| - css/
|	| - js/
|	| - images/
```

Each articles are formed of a `.txt` file and a folder which has the same name as the `.txt` text file. The folder should contains the essential `cover.jpg`, which is the cover photo of the article, as well as other photos you want to use in your article. Both of them need to be stored under the folder `articles/`. 

I suggest you not to delete any of the articles (including this one and the kitchen sink) before you start using the system. If you don't want these to show up on your blog index page, all you need to do is change the table in `default.txt`. `default.txt` and the folder `default/` are for the index page.

### If you *don't have* access to .htaccess file of your server 

You'll need to use GET method to tell the php script which article you want.

Google "HTTP GET method" or click [here](http://www.w3schools.com/tags/ref_httpmethods.asp) to read more about GET method.

*http://yourdomain.com/mangolb/* will display the contents in `default.txt`

*http://yourdomain.com/mangolb/?title=YOUR-ARTICLE-TITLE* will display the contents in `YOUR-ARTICLE-TITLE.txt`

Hence *http://yourdomain.com/mangolb/* is the same as *http://yourdomain.com/mangolb/?title=default*

### If you *have* access to .htaccess file of your server

Because GET method is the default option, in order to change to this method it takes a bit of work. But it makes your blog links look better.

By using this method you can use 

> *http://yourdomain.com/mangolb/YOUR-ARTICLE-TITLE* 

instead of 

> *http://yourdomain.com/mangolb/?title=YOUR-ARTICLE-TITLE*

#### Step 1

Copy and paste this code into your `.htaccess` file:

```
Options -MultiViews

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /mangolb/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /mangolb/index.php [L,NC,QSA]
</IfModule>
```

If you don't have a `.htaccess` file under your root folder, create one. You might not be able to see the existing one because `.htaccess` file's usually hidden.

If you are not putting the `mangolb/` folder under your root folder, you might want to change the path in the `.htaccess` file.

#### Step 2

Find `index.php`, open it with a code-editor (something like [Sublime Text](http://www.sublimetext.com/)), then find "@.htaccess". Follow the instructions of the comments that are below "@.htaccess" (comment SECTION A and uncomment SECTION B, both sections are within 30 lines from "@.htaccess"). 

#### Step 3

Change all the links in `default.txt` as well as other `.txt` files from "./?title=YOUR-ARTICLE-TITLE" into  "./YOUR-ARTICLE-TITLE".



## Start a new article

### Step 1: Give your new article a name

You need have two titles, one is for the name of your `.txt` file, another is your display title.

If your display title is "This is a wonderful story about Apple, Banana & Orange", I suggest you use "this-is-a-wonderful-story-about-apple-banana-and-orange" as the name of your `.txt` file and your folder.

Create a folder and a `.txt` file with the name you just decided, put both of them under `articles/`.

```diff
| + articles/
|   | + this-is-a-wonderful-story-about-apple-banana-and-orange/
|   |   | + cover.jpg
|   | + this-is-a-wonderful-story-about-apple-banana-and-orange.txt
```
You can ignore the `cover.jpg` by now.

Now open your 

```diff
this-is-a-wonderful-story-about-apple-banana-and-orange.txt
``` 

or what ever you've named it.

Specific your display title by putting a `# YOUR TITLE` at the beginning of your `.txt` file. Each article has to have one and only one \# title (`<h1>` title).

Javascript is used to apply SlabText to it, and move it into the cover section. Search "@SlabText" and "@PutH1IntoCover" in `index.php` to see the codes corresponding to it.

SlabText will split headlines into rows before resizing each row to fill the available horizontal space. In this case, the headline is our `<h1>` title.

Your new `.txt` file should look like this by now :

*articles/this-is-a-wonderful-story-about-apple-banana-and-orange.txt:*

```diff
# This is a wonderful story about Apple, Banana & Orange
```

### Step 2: Give your article a cover picture

I suggest you use a cover picture that does not have much bright area in it to provide a good contrast for the white title. Especially on IE, when the text-shadow is not supported. The subject of the picture should be at the centre of the image. I'm using `background-size: cover;` in css to control the size of my background image. A good explanation of how it works can be find on [here](http://blog.vjeux.com/2013/image/css-container-and-cover.html).

The recommended image size is at least 2000px wide, 1000px high, compress it with things like the "Save for Web" in Photoshop to reduce the size of the file.

Save it as `cover.jpg` under the folder.

```diff
| + articles/
|   | + this-is-a-wonderful-story-about-apple-banana-and-orange/
|   |   | + cover.jpg       <-SAVE IT HERE
|   | + this-is-a-wonderful-story-about-apple-banana-and-orange.txt
```

### Step 3: Provide the author name and date written

When giving the Author Name and Date Written, do this: 

```
**Author:** [AUTHOR NAME](#){#author .itemprop} **Date Written:** [YYYY-MM-DD](#){#datePublished .itemprop}
```
Please change the capitalised words into your own information.

To do so allows the search engines to find these informations.

I'm actually using a trick here. I'm using the syntax for links or `<a>` elements here, the php scripts in the `index.php` will convert it into `<span>` elements with corresponding attributes instead.

You can find the corresponding code by searching "@itemprop" in `index.php`.

You can also add extra information about the article behind these two.

Your new `.txt` file should look like something like this by now :

*articles/this-is-a-wonderful-story-about-apple-banana-and-orange.txt:*

```diff
# This is a wonderful story about Apple, Banana & Orange

**Author:** [MangleKuo](#){#author .itemprop} **Date Written:** [2015-05-29](#){#datePublished .itemprop} **LAST UNDATE** 2015-06-13 **Type:** Article

-----------------------------------------------

Start adding things here...
```

The line is not essential but it does make your article looks better.

![code and output](/images/./articles/how-to-use-this-blog-system/code_and_output.jpg) {.middle}

### Step 4: Start writing using Markdown and LaTeX! 

If you are not familiar with Markdown, [this](http://markdowntutorial.com/) is a really really good tutorial about Markdown made by GitHub. However, some extra feature is added from the original Markdown documentation. Read more about the extra feature [here](https://michelf.ca/projects/php-markdown/extra/).

When I talk about "LaTeX", I'm more focusing on the Maths Symbol part of it, the ideal of writing 2D Maths equations using plain text. If you want to learn more about it, read these web pages:

+ [http://www.latex-tutorial.com](http://www.latex-tutorial.com/symbols/)
+ [https://www.sharelatex.com](https://www.sharelatex.com/learn/Mathematical_expressions)

Or you can purchase and download [MyScript MathPad](https://itunes.apple.com/gb/app/myscript-mathpad-handwriting/id674996719?mt=8) for iPhone & iPad to hand write Maths formula

![MyScript MathPad](/images/./articles/how-to-use-this-blog-system/mathpad.jpg){.middle}

I'm using [MathType](http://www.dessci.com/en/products/mathtype/) on my Mac to generate formula virtually. It works on windows as well. If you have MathType, go to Preferences -> Cut and Copy Preferences, then choose MathML or TeX: LaTeX 2.09 and later to allow it output as LaTeX format.

![MathType](/images/./articles/how-to-use-this-blog-system/mathtype.jpg){.middle}

### Step 5: Add the link to default.txt

If you have finished writing and you decided to publish it, you simply add the link of this article to the table in `default.txt`.


## Things to be careful about

### Reserved Characters

Another thing is to be careful about reserved characters...

```diff
#1...Tom Scott  
#2...Jack Wilkinson  
[Hello]  
```

will be outputted as 

<div class="showcase" markdown="1">
##1...Tom Scott  
##2...Jack Wilkinson  
[Hello]  
</div>

which looks weird..

That's because `#` is used for Markdown, and `[]` are used for both Markdown and LaTeX.

For Markdown syntax, you can add a backward slash `\` before the characters you want to use.

So if you do

```diff
\#1...Tom Scott  
\#2...Jack Wilkinson  
```

it will becomes:

<div class="showcase" markdown="1">
\#1...Tom Scott   
\#2...Jack Wilkinson   
</div>

Great! What about the `[]`?

Hmmm.. Unfortunately for some reason it just won't work. My suggestion is avoid using `[]` in the text contents.

Here are characters which you might experience issues:

```
!$#%&*()[]{}-+_;<>`
```

If they are not appearing or appearing not in the way you are expecting, try to put a backward slash "\" before the character you want to use and see if it helps. Otherwise avoid using them.

Oh, and also the tab key. It's for block code. Use spaces instead.

### Pictures

You can insert a full width image by using the syntax

```
![IMAGE TITLE](/images/./articles/YOUR-ARTICLE-TITLE/IMAGE_TITLE.jpg){.middle}
```

However, sometimes you might not want a full width image. Especially when your image is tall and thin. If you want the image to float right, you can do

```
![IMAGE TITLE](/images/./articles/YOUR-ARTICLE-TITLE/IMAGE_TITLE.jpg){.right}
```

or left:

```
![IMAGE TITLE](/images/./articles/YOUR-ARTICLE-TITLE/IMAGE_TITLE.jpg){.left}
```

yet there are some issues about this. You need to make sure there are enough text after the image before you reach the next title.

For example, 


<div class="showcase" markdown="1">

### Lovely Blue Box

This is some introduction about the Blue Box...

The Blue Box looks like this:

![Blue Box](/images/./articles/how-to-use-this-blog-system/blue_box.jpg){.left} 

This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. This is some introduction for the image. 

What a lovely blue box it is, don't you think so...

### I'm the title of next section

And here are some text which has nothing to do with the blue box.

Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
Here are some more text which has nothing to do with the blue box.
</div>

is not what you want to see is it? 

On mobile it will look fine because on mobile all images will be 100% wide, but on desktop or larger screens the title of next section will appear at the right of the image. Keep this in mind and be careful when putting images as float left or right. Use Photoshop to add white margin at the left and right side of the image and use `.middle` instead when necessary. 

### Long things

These things won't fold on small screen hence it is better to keep their length short or use other way of displaying them instead.

#### 1. Long inline codes
e.g. `this-is-really-really-long-inline-code-block-which-is-going-to-be-too-wide-on-small-screen.txt`

Solution: use multiple line block codes instead:  
```diff
this-is-really-really-long-inline-code-block-which-is-going-to-be-too-wide-on-small-screen.txt
```

#### 2. Long links 
e.g. [http://3.141592653589793238462643383279502884197169399375105820974944592.com](http://3.141592653589793238462643383279502884197169399375105820974944592.com)

Solution: Don't use the full URL as the name of the link

[Pi to One Million Digits](http://3.141592653589793238462643383279502884197169399375105820974944592.com/)

#### 3. Tables 

Unless your table is really really really tiny like this one:
|x|1|2|
|-|-|-|
|1|1|2|
|2|2|4|

always wrap it with `<div class="table-wrapper" markdown="1"></div>`. It will make the table become full-width but scrollable when overflowed. A shadow at the right will appeal when the `<div>` become scrollable.

<div class="table-wrapper make-sortable" markdown="1">
|times| 1| 2| 3| 4| 5| 6| 7| 8| 9|
|-----|--|--|--|--|--|--|--|--|--|
|    1| 1| 2| 3| 4| 5| 6| 7| 8| 9|
|    2| 2| 4| 6| 8|10|12|14|16|18|
|    3| 3| 6| 9|12|15|18|21|24|27|
|    4| 4| 8|12|16|20|24|28|32|36|
|    5| 5|10|15|20|25|30|35|40|45|
|    6| 6|12|18|24|30|36|42|48|54|
|    7| 7|14|21|28|35|42|49|56|63|
|    8| 8|16|24|32|40|48|56|64|72|
|    9| 9|18|27|36|45|54|63|72|81|
</div>

You can add `.make-sortable` to the `<div>` to make the wrapped table sortable. (Try to click on one of the head of the table above)

The 9x9 table you see above, for example, has code :
```markdown
<div class="table-wrapper make-sortable" markdown="1">
|times| 1| 2| 3| 4| 5| 6| 7| 8| 9|
				.
				.
				.
				.
|    9| 9|18|27|36|45|54|63|72|81|
</div>
```


## THE END

If you have any questions or problems, please contact me through email: [ghcpuman902@gmail.com](mailto:ghcpuman902@gmail.com). You are also welcomed to folk this on [<i class="fa fa-github"></i> GitHub](https://github.com/ghcpuman902/mangolb) and make any commits.