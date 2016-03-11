
  function binaryToAscii(binary) {
    var str = '', i, regexp = /.{1,8}/g;
    var bytes = binary.match(regexp);
    for(i=0;i<bytes.length;i++){
      str += String.fromCharCode(parseInt(bytes[i], 2))
    }
    return str;
  }

  function asciiToBinary(str){
    var binary = '', len = str.length, i, byte;
    for(i=0;i<len;i++){
      byte = str.charCodeAt(i).toString(2);
      binary += (new Array(9 - byte.length).join('0') + byte);
    }
    return binary
  }