function isPalindrome(string) {
    let newString = string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    newString = newString.replace(/ /g, "").toLowerCase();
    
    let isPalindrome = true;
    for (let i = 0; i < newString.length / 2; i++) {
        if (newString[i] !== newString[newString.length - i - 1]) {
            isPalindrome = false;
            break;
        }
    }

    if (isPalindrome) {
        console.log("It is a palindrome");
    } else {
        console.log("It is not a palindrome");
    }
}

isPalindrome("A man a plan a canal Panama");