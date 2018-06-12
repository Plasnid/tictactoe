function arrayDif(arr1, arr2){
    let arr1Leng = arr1.length;
    let difData = (function(){
        for(let i=0;i<arr1Leng;i++){
            if(arr1[i]!==arr2[i]){
                return {pos: i, val: arr1[i]};
            }
        }
    })();
    difData.row = getRow(difData.pos, 3);
    difData.column = getColumn(difData.pos, 3);
    return difData;
}
function getRow(arrPos, width){
    return Math.floor(arrPos/width);
}
function getColumn(arrPos, width){
    return Math.floor(arrPos%width);
}
function checkForTie(squares){
    let isTie = squares.every(function(square, i) {return square;});
    return isTie;
}
function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for(let i = 0; i < lines.length;i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a]===squares[c]){
            return squares[a];
        }
    }
    return null;
}