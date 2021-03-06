function xformT(op1, op2) {
  if (op1.type === 'insert') {
    if (op2.type === 'insert') {
      return xformTii(op1, op2);
    }
    if (op2.type === 'delete') {
      return xformTid(op1, op2);
    }
  }
  if (op1.type === 'delete') {
    if (op2.type === 'insert') {
      var xformed = xformTid(op2, op1);

      return [xformed[1], xformed[0]];
    }
    if (op2.type === 'delete') {
      return xformTdd(op1, op2);
    }
  }
  return [op1, op2];
}

function xformTii(op1, op2) {
  var tpt = transformationPoint(op1.accessPath, op2.accessPath);

  if (effectIndependent(op1.accessPath, op2.accessPath)) {
    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] > op2.accessPath[tpt][''+tpt]) {
    op1.accessPath[tpt][''+tpt]++;
    return [op1, op2]; 
  }

  if (op1.accessPath[tpt][''+tpt] < op2.accessPath[tpt][''+tpt]) {
    op2.accessPath[tpt][''+tpt]++;
    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] === op2.accessPath[tpt][''+tpt]) {
    if (op1.accessPath.length > op2.accessPath.length) {
      op1.accessPath[tpt][''+tpt]++;
      return [op1, op2];
    }

    if (op1.accessPath.length < op2.accessPath.length) {
      op2.accessPath[tpt][''+tpt]++;
      return [op1, op2];
    }

    if (op1.accessPath.length === op2.accessPath.length) {
      //application depndent priorities
        op2.accessPath[tpt][''+tpt]++;
        return [op1, op2];
    }
  }
}

function xformTid(op1, op2) {
  console.log('inside xformTid', op1, op2)
  var tpt = transformationPoint(op1.accessPath, op2.accessPath);

  if (effectIndependent(op1.accessPath, op2.accessPath)) {
    console.log('effect independent', op1, op2)

    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] > op2.accessPath[tpt][''+tpt]) {
    console.log('op1.accessPath[ op2.accessPath[ it should reduce op1 accessPath by one', op1, op2)

    op1.accessPath[tpt][''+tpt]--;
    return [op1, op2]; 
  }

  if (op1.accessPath[tpt][''+tpt] < op2.accessPath[tpt][''+tpt]) {
    console.log('op1.accessPath[tpt] < op2.accessPath[tpt] -> it should increase op2 accessPath by one', op1, op2)
    op2.accessPath[tpt][''+tpt]++;
    console.log('op2: ', op2.accessPath)
    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] === op2.accessPath[tpt][''+tpt]) {

    if (op1.accessPath.length > op2.accessPath.length) {
      console.log('op1.accessPath[tpt] === op2.accessPath[tpt] -> BUT op1.accessPath.length > op2.accessPath.length -> OP1 NO OP', op1, op2)
      op1.type = 'no-op';
      return [op1, op2];
    }
      console.log('op1.accessPath[tpt] === op2.accessPath[tpt] -> BUT op1.accessPath.length <= op2.accessPath.length -> OP2 should be increased by 1', op1, op2)

    op2.accessPath[tpt][''+tpt]++;
    return [op1, op2];
  }

}

function xformTdd(op1, op2) {
  var tpt = transformationPoint(op1.accessPath, op2.accessPath);

  if (effectIndependent(op1.accessPath, op2.accessPath)) {
    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] > op2.accessPath[tpt][''+tpt]) {
    op1.accessPath[tpt][''+tpt]--;
    return [op1, op2]; 
  }

  if (op1.accessPath[tpt][''+tpt] < op2.accessPath[tpt][''+tpt]) {
    op2.accessPath[tpt][''+tpt]--;
    return [op1, op2];
  }

  if (op1.accessPath[tpt][''+tpt] === op2.accessPath[tpt][''+tpt]) {
    if (op1.accessPath.length > op2.accessPath.length) {
      op1.type = 'no-op';
      return [op1, op2];
    }

    if (op1.accessPath.length < op2.accessPath.length) {
      op2.type = 'no-op';
      return [op1, op2];
    }

    if (op1.accessPath.length === op2.accessPath.length) {
      op1.type = 'no-op';
      op2.type = 'no-op';
      return [op1, op2];
    }
  }

}

function transformationPoint(accessPath1, accessPath2) {
  var smallLength = accessPath1.length > accessPath2.length ? accessPath2.length : accessPath1.length;

  for (var i = 0; i < smallLength; i++) {
    if (accessPath1[i][''+i] !== accessPath2[i][''+i]) {
      return i;
    }
  }

  return smallLength - 1;
}

function effectIndependent(accessPath1, accessPath2) {
  var tpt = transformationPoint(accessPath1, accessPath2);

  if ((accessPath1.length > tpt+1) && (accessPath2.length > tpt+1)) {
    return true;
  }
  if ((accessPath1[tpt][''+tpt] > accessPath2[tpt][''+tpt]) && (accessPath1.length < accessPath2.length)) {
    return true;
  }
  if ((accessPath1[tpt][''+tpt] < accessPath2[tpt][''+tpt]) && (accessPath1.length > accessPath2.length)) {
    return true;
  }

  return false;
}

export default xformT;
