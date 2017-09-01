var self = this;

function connect() {
    //IPアドレスの取得
    var pepperIp = $("#ip1").val();

    //A variable is set as a proxy
    var setupIns_ = function () {
        self.qims.service("ALMemory").done(function (ins) {
            self.alMemory = ins;

            //メモリー監視
            qimessagingMemorySubscribe();
        });

        self.qims.service("ALTextToSpeech").done(function (ins) {
            self.alTextToSpeech = ins;
        });
        self.qims.service("ALAnimatedSpeech").done(function (ins) {
            self.alAnimatedSpeech = ins;
        });
        self.qims.service("ALMotion").done(function (ins) {
            self.alMotion = ins;
        });
        self.qims.service("ALBehaviorManager").done(function (ins) {
            self.alBehavior = ins;
        });
        self.qims.service("ALAutonomousLife").done(function (ins) {
            self.alAutonomousLife = ins;
        });
        sel.qims.service("ALAudioDevice").done(function (ins) {
            self.alAudioDevice = ins;
            self.alAudioDevice.getOutputVolume().done(function (val) {
                self.showAudioVolume(val);
            });
        });
    }
    //Connect to Pepper
    self.qims = new QiSession(pepperIp);
    self.qims.socket()
        .on('connect', function () {
            self.qims.service("ALTextToSpeech")
                .done(function (tts) {
                    tts.say("接続しました");
                });
            //set up
            setupIns_();

            $(".ip > .connected > .connectedText").text("Connected");
            $(".ip > .connected").css("color", "azure");

        })
        .on('disconnect', function () {
        });
}

//Show volume
function showAudioVolume(val) {
    console.log(val);
    $("#pepperVolume").val(val);
}

//Change volume
function changeAudioVolume() {
    var volume = $("#pepperVolume").val();
    volume = Number(volume);
    console.log(Number(volume));
    self.alAudioDevice.setOutputVolume(volume);
    self.hello();
}

//Sample speech
function hello() {
    console.log("hello");
    this.alAnimatedSpeech.say("こんにちは");
}

//Text Message
function say() {
    console.log("say");
    var value = $("#sayText").val();
    this.alTextToSpeech.say(value);
}

//Animated say
function animetedSay() {
    console.log("say");
    var value = $("#animatedSay").val();
    this.alAnimatedSpeech.animetedSay(value);
}

//move
function move(to) {
    if (self.alMotion) {
        console.log("move to");
        switch (to) {
            case 0:
                //left
                self.alMotion.moveTo(0, 0.3, 0).fail(function (err) { console.log(err); });
                break;
            case 1:
                //right
                self.alMotion.moveTo(0, -0.3, 0).fail(function (err) { console.log(err); });
                break;
            case 2:
                //front
                self.alMotion.moveTo(0.3, 0, 0).fail(function (err) { console.log(err); });
                break;
            case 3:
                //back
                self.alMotion.moveTo(-0.3, 0, 0).fail(function (err) { console.log(err); });
                break;
            case 4:
                //turn left
                self.alMotion.moveTo(0, 0, 0.5).fail(function (err) { console.log(err); });
                break;
            case 5:
                //turn right
                self.alMotion.moveTo(0, 0, -0.5).fail(function (err) { console.log(err); });
                break;
            case 6:
                //default
                self.alMotion.moveTo(0, 0, 0).fail(function (err) { console.log(err); });
                break;
        }
    }
}

//behavior
function action(num) {
    switch (num) {
        case 0:
            //cmd5
            self.alBehavior.runBehavior("");
            break;
        case 1:
            //cmd6
            self.alBehavior.runBehavior("");
            break;
        case 2:
            //stop all behaviors
            self.alBehavior.stopAllBehaviors();
    }
}

//Switch autonomous life mode
function autonomousSwich(bl) {
    var status;
    if (bl) {
        console.log("on");
        self.alAutonomousLife.getState().done(function (val) { console.log(val) });
        self.alAutonomousLife.setState("solitary");
    } else {
        console.log("off");
        self.alAutonomousLife.getState().done(function (val) { console.log(val) });
        self.alAutonomousLife.setState("disabled");
    }
}

//"sleep" or "wake up" mode
function sleepSwitch(bl) {
    var status;
    if (bl) {
        console.log("on");
        self.alMotion.wakeUp();
    } else {
        console.log("off");
        self.alMotion.rest();
    }
}

//alMemory Event
function qimessagingMemoryEvent() {
    console.log("push");
    self.alMemory.raiseEvent("PepperQiMessaging/Hey", "1");
}
function qimessagingMemorySubscribe() {
    console.log("subscribe");
    self.alMemory.subscriber("PepperQiMessaging/Reco").done(function (subscriber) {
        subscriber.signal.connect(toTabletHandler);
    }
    );
}
function toTabletHandler(value) {
    console.log("PepperQiMessaging/Recoイベント発生:" + value);
    $(".memory").text(value);
}