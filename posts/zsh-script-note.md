---
title: 'macOS zsh script note'
date: '2021-08-02'
description: 'I tried hard to learn zsh script today, and I want to make a note about it.'
---

I tried hard to learn zsh script today, and I want to make a note about it.

- It's very strict on spaces and new lines
- If you can't find any result on Google searching with "zsh script how to", just try with "bash script how to"
- No error message when something is undefiend. 
- Very particular about how things are defined and nested. If you can, use a seperate variable, don't nest things.
- For both the shell and the script, new line and array are kind of interchangable. its even more so in bash, where spaces have the same behaviour. Save the array output as a variable, so it's forced to be converted to string, for a more predictable behaviour.
- You can use all the power of Linux shell within it, like awk and sort, inside a $().

Template:
```
#!/bin/zsh

# v0.1.0
# made by Mangle Kuo
# manglekuo.com
# MIT License

myFunc() {
    echo "The input is $1";
}

# Using function is like runing things in shells, no parenthesis involved.
myFunc "use myFunc directly";

echo $(myFunc "use myFunc as input for echo");

echo "====Terms & Conditions====
- Stay strong
- Stay healthy
- Stay true to yourself
";

read -qs "REPLY?Agree and continue?(y/N)"
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	echo;
	echo "Okay, bye~";
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi;
echo;
echo;

echo "You are brave, let's move on.";


varA="This is a beautiful beautiful world";
varB="cruel";

# replace
echo "${varA/beautiful/$varB}";
# -> This is a cruel beautiful world

# replace to nothing
echo "${varA/beautiful}";
# -> This is a  beautiful world

# replace all
echo "${varA//beautiful/$varB}";
# -> This is a cruel cruel world


# Excute some command and get the output as string, no space
results=$(ls -lA);
echo $results;

# Convert the output as array, space is important
resultsArray=( ${(ps/\n/)results} );


for result in $resultsArray
do
	echo "-> $result";
done

# Refer to the array
echo ${resultsArray[2]}
echo "2nd item of array is ${resultsArray[2]}";


```