$(function() {
    // ボタンアニメーション(第2引数は秒数)
    $('.button-more').on('mouseover', function() {
        // $(this)：データ取得専用の変数.animate()メソッドで動きを加える
        $(this).animate({
            marginLeft: 20,
            opacity: 0.5
        }, 100);
    });

    $('.button-more').on('mouseout', function() {
        $(this).animate({
            marginLeft: 0,
            opacity: 1
        }, 100);
    });

    $('.carousel').slick({
        // autoplay：画像を自動的に切り替えるかどうか
        autoplay: true,
        // dots：「現在何枚目の画像を表示しているか」を示すUI（ドット）を表示するかどうか
        dots: true,
        // infinite：画像をループさせるかどうか
        infinite: true,
        // autoplaySpeed：次の画像に切り替えるまでの待ち時間
        autoplaySpeed: 5000,
        // arrows：画像を手動で切り替えるための矢印ボタンを表示するかどうか
        arrows: false,
    });

    // AjaxでSTATIC FORMSにデータを送信
    // 引数eventの中には、クリックした送信ボタンに関する情報(オブジェクト)が入っている
    $('#submit').on('click', function(event) {
        // preventDefault()メソッド：formタグによるフォームの送信をキャンセルする
        event.preventDefault();

        // 入力チェックをした結果、エラーがあるかないか判定
        let result = inputCheck();

        // エラー判定とメッセージを取得
        let error = result.error;
        let message = result.message;

        // エラーが無かったらフォームを送信する
        if (error == false) {
            // Ajaxでformを送信する
            $.ajax ({
                url: 'https://api.staticforms.xyz/submit',
                type: 'POST',
                dataType: 'json',
                // data：フォームの入力内容（$('#form')で取得できる）
                data: $('#form').serialize(),
                // success：送信に成功したときの処理（送信完了メッセージを表示させる）
                success: function(result) {
                    alert("お問い合わせを送信しました。");
                },
                // error：何らかの理由で送信できなかったときの処理
                error: function (xhr, resp, text) {
                    alert("お問い合わせを送信できませんでした。");
                }
            })
        } else {
            // エラーメッセージを表示する
            alert(message);
        }
    });

    // 各フォームの入力直後にinputCheck()関数を呼び出す
    // blur：別の入力画面にカーソルが移動したとき
    // フォーカスが外れたとき（blur）にフォームの入力チェックをする
    $('#name').blur(function() {
        inputCheck();
    });

    $('#furigana').blur(function() {
        inputCheck();
    });

    $('#email').blur(function() {
        inputCheck();
    });

    $('#tel').blur(function() {
        inputCheck();
    });

    $('#message').blur(function() {
        inputCheck();
    });

    $('#agree').click(function() {
        inputCheck();
    });
    

    // お問い合わせフォームの入力チェック
    function inputCheck(){
        console.log("inputCheck関数の呼び出し");

        // 変数messageと変数errorを関数inputCheckの戻り値として返すためのオブジェクトを格納する変数（
        let result;

        // エラーメッセージのテキスト
        let message = "";
        // エラーがなければfalse、エラーがあればtrue
        let error = false;
        // 「お名前」のチェック：#nameの値が空欄ならば
        if ($('#name').val() == "") {
            // エラーあり：フォームを赤色に変更
            $('#name').css('background-color', '#f79999');
            error = true;
            message += 'お名前を入力してください。\n';
        } else {
            // エラーなし：フォームを灰色に変更
            $('#name').css('background-color', '#fafafa');
        }

        // 「フリガナ」のチェック
        if ($('#furigana').val() == "") {
            // エラーあり
            $('#furigana').css('background-color', '#f79999');
            error = true;
            message += 'フリガナを入力してください。\n';
        } else {
            // エラーなし
            $('#furigana').css('background-color', '#fafafa');
        }

        // 「お問い合わせ」のチェック
        if ($('#message').val() == "") {
            // エラーあり
            $('#message').css('background-color', '#f79999');
            error = true;
            message += "お問い合わせ内容を入力してください。\n";
        } else {
            // エラーなし
            $('#message').css('background-color', '#fafafa');
        }

        // メールアドレスのチェック
        // indexOf('文字列')メソッド：指定した文字が何文字目に含まれるかを数値で返すメソッド。含まれていないと-1が返ってくる
        if ($('#email').val().indexOf('@') == -1 || $('#email').val().indexOf('.') == -1 || $('#email').val() == "") {
            // エラーあり
            $('#email').css('background-color', '#f79999');
            error = true;
            message += "'メールアドレスが未記入、または「@」「.」が含まれていません。\n";
        } else {
            // エラーなし
            $('#email').css('background-color', '#fafafa');
        }

        // 電話番号のチェック
        // 今回は未入力でもOK。入力済かつハイフンがないときにエラー扱いとする
        if ($('#tel').val().indexOf('-') == -1 && $('#tel').val() != "") {
            // エラーあり
            $('#tel').css('background-color', '#f79999');
            error = true;
            message += "電話番号に「-」が含まれていません。\n";
        } else {
            // エラーなし
            $('#tel').css('background-color', '#fafafa');
        }

        // 個人情報のチェックボックスのチェック
        // prop('checked')メソッド：チェックボックスのチェックの有無を取得する
        if ($('#agree').prop('checked') == false) {
            // チェックなし
            error = true;
            message += '個人情報の取り扱いについてご同意いただける場合は、チェックボックスにチェックしてください。\n';
        }

        // エラーの有無で送信ボタンを切り替え
        // attr()メソッド：属性を取得して編集する？
        if (error == true) {
            $('#submit').attr('src', 'images/button-submit.png');
        } else {
            $('#submit').attr('src', 'images/button-submit-blue.png');
        }
    // オブジェクトでエラー判定とメッセージを返す
    result = {
        error: error,
        message: message
    }

    // 戻り値としてエラーがあるかどうかを返す
    return result;
    }
});

