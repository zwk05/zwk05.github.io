var form = document.forms.item(0);
var inputs = form.querySelectorAll("input");
var phoneDom = form.querySelector(".phone");
var codeDom = form.querySelector(".code");
var usernameDom = form.querySelector(".username");
var passwordDom = form.querySelector(".password");
var repasswordDom = form.querySelector(".repassword");

var phoneRegex = /^\d{11}$/;
var codeRegex = /^\d{4}$/;
var usernameRegex = /^(\w|[\u3040-\u9fff]){3,20}$/;
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/



// 只会返回布尔值
function check(str, regex) {
    return regex.test(str);
}

inputs.forEach(function (input, index, inputs) {
    input.oninput = function (event) {
        switch (this.name) {
            case "phone":
                if (check(this.value, phoneRegex)) {
                    phoneDom.classList.remove("error");
                    phoneDom.classList.add("success");
                } else {
                    phoneDom.classList.remove("success");
                    phoneDom.classList.add("error");
                }
                break;
            case "code":
                if (check(this.value, codeRegex)) {
                    codeDom.classList.remove("error");
                    codeDom.classList.add("success");
                } else {
                    codeDom.classList.remove("success");
                    codeDom.classList.add("error");
                }
                break;
            case "username":
                if (check(this.value, usernameRegex)) {
                    usernameDom.classList.remove("error");
                    usernameDom.classList.add("success");
                } else {
                    usernameDom.classList.remove("success");
                    usernameDom.classList.add("error");
                }
                break;
            case "password":
                if (check(this.value, passwordRegex)) {
                    passwordDom.classList.remove("error");
                    passwordDom.classList.add("success");
                } else {
                    passwordDom.classList.remove("success");
                    passwordDom.classList.add("error");
                    if (this.value.length >= 6) {
                        passwordDom.querySelector('span').innerText = '密码太简单，有被盗风险，建议字母+数字的组合'
                    }

                }
                break;
            case "repassword":
                break;
        }
    };
});