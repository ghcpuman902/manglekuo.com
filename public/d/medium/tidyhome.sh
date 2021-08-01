#!/bin/zsh

# v0.1.0
# made by Mangle Kuo
# manglekuo.com
# MIT License

################################################
################ CONFIGURATIONS ################
################################################

target=~/;

# Folders that will get ignored one level into the targeting forlder
ignoredFolders="Desktop
.Trash
Public
Dev
Downloads
Documents
Applications
Library
Music
Pictures
Movies
Creative Could Files
Dropbox
Google Drive";

recursivelySearch=false;


################################################
################## HOW TO USE ##################
################################################

# 1. Change the above configurations according to your need

# 2. In Terminal, enter the directory this file is in and run:
# ```
# % chmod 755 tidyhome.sh
# % ./tidyhome.sh
# ```

# (Not including the % sign)

# 3. You look through the printed result from bottom to top; the bottom is the oldest directory or files. The format is: `File_or_directory_name	File_size	File_last_modified_date`. 

# 	One thing with macOS Finder is that it does not give out the last modified date based on the files inside a directory but rather gives out the last modified date of the directory itself.

# 	This script solves this problem by recursively searching through the directory and presenting you with the newest 5 files (or directories), so you can better judge how old this directory actually is.



################################################
################################################
################################################


echo "tidyhome v0.1.0 made by Mangle Kuo (https://manglekuo.com)
under MIT License

NOTICE
- This script helps review directories, by displaying newest 5 
  files within a directory. 
- If all 5 files have old last modified date, it probably means no 
  one is using the parent directory, which you should consider 
  deleting. 
- By default, it only goes one level deep, open and edit this 
  shell script file to make it search recursively. 
- Do not run this script using super user (su or sudo), this 
  script has only be tested on macOS Big Sur v11.4, I'm not 
  responsible for any damages this script might cause while 
  running it. 
- This may include but not limited to: lost of files, bricked 
  computer, lost of lives, etc. 
- ALWAYS CHECK BEFORE RUNNING SOMETHING YOU DOWNLOADED FORM THE 
  INTERNET";
echo;
echo "TL;DR: If things break, it's yoru fault.";
read -qs "REPLY?Agree and continue?(y/N)"
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	echo;
	echo "Okay, bye~";
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi;
echo;
echo;





echo "Target directory:\n\t$target";
echo "Ignored folders: \n$( echo $ignoredFolders | awk '{ print "\t"$1; }' )";
read -qs "REPLY?Ok?(y/N)"
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	echo;
	echo "Okay, bye~";
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi
echo;
echo;





read -qs "REPLY?Seach recursively?(y/N)"
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	recursivelySearch=true;
fi





ignoredFoldersArray=( ${(ps/\n/)ignoredFolders} );
# Convert string to array


shortenPath() {
	# Replace the target part of path to nothing
	echo "${1//$target}"
}

result=$(stat -f '%Sm£%N£%z' -t '%FT%T' $target.* $target* | sort -rn);
resultArray=( ${(ps/\n/)result} );
# Get an array of files and directories within the target directory, sorted by last modified date, in dec order

for FILE in $resultArray
do 
	fileProps=( ${(ps/£/)FILE} );
	# Split the line into array using the pound sign

	folderPath=$(shortenPath ${fileProps[2]});


	if [[ " ${ignoredFoldersArray[@]} " =~ " ${folderPath} " ]]; then
		# When folderPath is included in the ignoredFoldersArray
		echo "$folderPath is ignored.\n"
	else
		if [ -d ${fileProps[2]} ] && [ "$(ls -A ${fileProps[2]})" ]; then
			# Check if is directory and directory not empty

			if [ "$recursivelySearch" = true ]; then
				# Do recurseve search
				newestFiles=$(find ${fileProps[2]} -type f -print0 | xargs -0 stat -q -f "%Sm£%N£%z" -t '%FT%T' | sort -nr | head -5 | awk 'BEGIN {FS="£"} function human(x) { if (x<1000) {return x} else {x/=1024} s="kMGTEPZY"; while (x>=1000 && length(s)>1) {x/=1024; s=substr(s,2)} return int(x+0.5) substr(s,1,1) } {print "|----"$2"\t"human($3)"B\t"$1}' | column -s$'\t' -t);
				# find to recursively search
				# xargs for better efficiency
				# stat to get last modified date, file name, file size
				# sort to sort in dec order
				# head to trim the result to only top 5
				# awk to change the display order to file name, file size, last modified date
				# awk also added the formatting for the file size
				# colume to make displayed result pretty
				echo -e "|$folderPath\t$(numfmt --to=iec-i --suffix=B ${fileProps[3]})\t${fileProps[1]}\n$newestFiles\n";
				# numfmt to format the file size

			else
				# Don't do recurseve search
				subDir="${fileProps[2]}";
				resultSubDir=$(stat -q -f "%Sm£%N£%z" -t '%FT%T' $subDir/* | sort -rn | head -5 | awk 'BEGIN {FS="£"} function human(x) { if (x<1000) {return x} else {x/=1024} s="kMGTEPZY"; while (x>=1000 && length(s)>1) {x/=1024; s=substr(s,2)} return int(x+0.5) substr(s,1,1) } {print "|----"$2"\t"human($3)"B\t"$1}' | column -s$'\t' -t);	
				# stat to get last modified date, file name, file size
				# sort to sort in dec order
				# head to trim the result to only top 5
				# awk to change the display order to file name, file size, last modified date
				# awk also added the formatting for the file size
				# colume to make displayed result pretty
				echo -e "|$folderPath\t$(numfmt --to=iec-i --suffix=B ${fileProps[3]})\t${fileProps[1]}\n$(shortenPath $resultSubDir)";
				# numfmt to format the file size

			fi
		else
			# When it is not a directory, but a file
			echo -e "|$(shortenPath ${fileProps[2]})\t$(numfmt --to=iec-i --suffix=B ${fileProps[3]})\t${fileProps[1]}"
			# numfmt to format the file size
							
		fi
	fi

	echo -e "====================================================";
done
