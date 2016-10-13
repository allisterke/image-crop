/**
 * Created by zmd on 2016/9/23.
 */
function DrawImage(ImgD){
    var iwidth = 500;
    var iheight = 700;
    var scalling1 = ImgD.height / ImgD.width;
    var scalling2 = ImgD.width / ImgD.height;

    if (ImgD.width > 0 && ImgD.height > 0){
        if(ImgD.width/ImgD.height >= iwidth/iheight){
            ImgD.width = iwidth;
            ImgD.height = iwidth * scalling1;
        }
        else{
            ImgD.height = iheight;
            ImgD.width = iheight * scalling2;
        }
    }
}

var images = ["IMG_2288.JPG", "IMG_2304.JPG", "IMG_2449.JPG", "IMG_2613.JPG"];
var index = 0;

function checkBox(){
    var element_str = document.getElementsByName("element");
    var element_check = "";

    var style_str = document.getElementsByName("style");
    var style_check = "";

    for(i=0;i<element_str.length;i++){
        if(element_str[i].checked == true){
            if(i == element_str.length - 1){
                var elm_input = document.getElementById("text1");
                if(elm_input.value != ""){
                    element_check += elm_input.value + " ";
                }
            }
            else {
                element_check += element_str[i].value + " ";
            }
        }
    }
    for (i=0;i<style_str.length;i++){
        if(style_str[i].checked == true){
            if(i == style_str.length - 1){
                var stl_input = document.getElementById("text2");
                if(stl_input.value != ""){
                    style_check += stl_input.value + " ";
                }
            }
            else {
                style_check += style_str[i].value + " ";
            }
        }
    }
    if(element_check=="" && style_check==""){
        alert("Please choose one element tag and one style tag at least.")
    }
    else if(element_check == ""){
        alert("Please choose one element tag at least.");
    }
    else if(style_check == ""){
        alert("Please choose one style tag at least.");
    }
    else{
        // alert("The element tag is: " + element_check + '\n' + "The style tag is: " + style_check);

        // index ++;
        // if(index == images.length){
        //     index = 0;
        // }
        // document.getElementById("img1").src="images/" + images[index];

        for(i=0;i<element_str.length;i++){
            element_str[i].checked = false;
        }
        for(i=0;i<style_str.length;i++){
            style_str[i].checked = false;
        }
        // elm_input.value = "";
        // elm_input.readOnly = true;
        // stl_input.value = "";
        // stl_input.readOnly = true;

        window.ie.submitTags(element_check + ' ' + style_check);
    }
}

function writeTag1() {
    var element_str = document.getElementsByName("element");
    var len = element_str.length;
    if(element_str[len - 1].checked == true){
        document.getElementById("text1").readOnly = false;
    }
}

function writeTag2() {
    var style_str = document.getElementsByName("style");
    var len = style_str.length;
    if(style_str[len - 1].checked == true){
        document.getElementById("text2").readOnly = false;
    }
}

function download_image() {
    console.log($("#img1")[0].src);
    window.open($("#img1")[0].src);
//            window.open("http://muri.oss-cn-hangzhou.aliyuncs.com/patterns2015/-0JcGmPjqlslP0cjwJdMk2TptpR7Femw5xNazr9BzMAF38-r1Rh7mhDlxqBpYbLv.jpg");
}
