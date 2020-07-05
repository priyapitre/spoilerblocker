// This script fetches the current blockList
// Previously hidden elements that are no longer in the current blockList
// are stripped of the Spoilerss class and shown.
// All current elements of blockList are assigned the SpoilersTemp class and hidden;


function block(blockList) {
    if (blockList == null) {
        $(".Spoilerss").removeClass("Spoilerss").show();
    } else {
        for (i = 0; i < blockList.length; ++i) {
            $(":contains("+blockList[i]+"):not(:has(div))").removeClass("Spoilerss").addClass("SpoilersTemp");
        }
        $(".Spoiless").removeClass("Spoilerss").show();
        $(".SpoilersTemp").removeClass("noSpoilersTemp").addClass("Spoilerss").css('-webkit-filter', 'blur(5px)');
    }
};




















function getBlockList() {
    chrome.runtime.sendMessage({method: "getStorage", key: "blockList"}, function(response) {
        block(response.data);
    });
}

getBlockList();
