function initialize() {
    window.current_nav_id = 'nav_1';
    $("#origin").bind("input propertychange", function () {
        on_text_changed();
    });

    let clipboard = new ClipboardJS('#copy_button');
    //复制成功执行的回调
    clipboard.on('success', function (e) {
        console.log('copy success');
    });
    //复制失败执行的回调
    clipboard.on('error', function (e) {
        console.log('copy failed:');
    });

    styleControl();
}


function styleControl() {
    if(!isPC()){
        $('#button-group').html("<div class=\"col\">\n" +
            "                        <button class=\"btn btn-primary\" id=\"copy_button\" data-clipboard-target=\"#replaced\">复 制</button>\n" +
            "                        <button class=\"btn btn-primary\" data-toggle=\"button\" onclick=\"on_clear_clicked()\">清 空</button>\n" +
            "                        <button class=\"btn btn-primary\" data-toggle=\"button\" onclick=\"on_translate_clicked()\">翻 译\n" +
            "                        </button>\n" +
            "                    </div>");
    }
}

/**
 * 切换不同的翻译选项
 * @param nav_id 翻译选项id
 */
function nav_bar_active(nav_id) {
    window.current_nav_id = nav_id;//存一个全局变量，以便后面用来判断是否翻译
    switch (nav_id) {
        case 'nav_1':
            $("#nav_1").attr('class', 'nav-item active');
            $("#nav_2").attr('class', 'nav-item');
            $("#nav_3").attr('class', 'nav-item');
            $("#google_translate_control").attr('style', '');
            break;
        case 'nav_2':
            $("#nav_1").attr('class', 'nav-item');
            $("#nav_2").attr('class', 'nav-item active');
            $("#nav_3").attr('class', 'nav-item');
            $("#baidu_translate_control").attr('style', '');
            break;
        case 'nav_3':
            $("#nav_1").attr('class', 'nav-item');
            $("#nav_2").attr('class', 'nav-item');
            $("#nav_3").attr('class', 'nav-item active');
            $("#baidu_translate_control").attr('style', 'display:none;');
            $("#google_translate_control").attr('style', 'display:none;');
            break;
        case 'nav_4':
            break;
        default:
            alert('bad nav_id:' + nav_id)
    }
}

let google_url = 'https://translate.google.cn/#en/zh-CN/';
let baidu_url = 'https://fanyi.baidu.com/#en/zh/';

function on_translate_clicked() {
    let text = $("#replaced").val();
    // 根据nav_id来判断是否翻译文本以及使用的翻译源
    switch (window.current_nav_id) {
        case 'nav_1':
            // 打开google翻译
            window.open(google_url + text, "_blank");
            break;
        case 'nav_2':
            // 打开百度翻译
            window.open(baidu_url + text, "_blank");
            break;
        case 'nav_3':
            // 不翻译
            break;
        default:
            alert('bad nav_id:' + window.current_nav_id);
    }
}

/**
 * 左边文本框变化时，把状态及时更新到右边文本框；
 * 若checkbox被选中，那么模拟按钮被点击，复制替换回车后的内容到剪贴板
 */
function on_text_changed() {
    let ori_text = $("#origin").val();
    // 替换段横线和之后的回车
    let line_break = new RegExp('-\n', 'g');
    let replaced_text = ori_text.replace(line_break, '');
    // 替换文本中的回车
    let short_dash = new RegExp("\n", "g"); //第一个参数是要替换掉的内容，第二个参数"g"表示替换全部（global）。
    replaced_text = replaced_text.replace(short_dash, ' ');
    $("#replaced").val(replaced_text);
    $("#text_p").text(replaced_text);
    // 判断是否需要自动复制
    if ($("#auto_copy").is(':checked')){
        $("#copy_button").click();
        $('#origin').focus();
    }
}

/**
 * 清空两个文本框
 */
function on_clear_clicked() {
    $("#origin").val('');
    $("#replaced").val('');
    $("#text_p").text('');
    $('#origin').focus();
}


/**
 * @return {boolean}
 */
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}