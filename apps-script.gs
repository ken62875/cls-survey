/**
 * 수시 지원 전략 자가진단 — 구글 스프레드시트 접수함
 * app.clsedu.co.kr/susi.html 이 보낸 결과를 '접수' 시트에 한 줄씩 쌓는다.
 */

var SHEET_NAME = '접수';

// 새 접수가 들어올 때 메일로도 받고 싶으면 주소를 적는다. 비워 두면 보내지 않는다.
var NOTIFY_EMAIL = '';

var TYPE_ORDER = ['gyogwa', 'jonghap', 'myeonjeop', 'nonsul', 'yaksul', 'seoryu'];
var TYPE_LABEL = {
  gyogwa: '교과', jonghap: '학종 서류', myeonjeop: '학종 면접',
  nonsul: '일반논술', yaksul: '약술형', seoryu: '특기자'
};
var FIELD_ORDER = ['inmun', 'sahoe', 'jayeon', 'gonghak', 'gyoyuk'];
var FIELD_LABEL = {
  inmun: '인문', sahoe: '사회', jayeon: '자연', gonghak: '공학', gyoyuk: '교육'
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);            // 동시에 두 명이 제출해도 줄이 섞이지 않도록
  try {
    var data = JSON.parse(e.postData.contents);
    sheet_().appendRow(row_(data));
    notify_(data);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 진단 페이지 첫 화면에 보여 줄 완료 인원을 돌려준다.
 * 주소가 서로 달라 브라우저가 응답을 막으므로, 스크립트 형태(JSONP)로 내보낸다.
 */
function doGet(e) {
  var p = (e && e.parameter) || {};

  if (p.count) {
    var n = 0;
    try {
      var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (sh) n = Math.max(sh.getLastRow() - 1, 0);   // 제목 줄은 뺀다
    } catch (err) { n = 0; }

    var body = JSON.stringify({ ok: true, n: n });
    if (p.callback) {
      return ContentService
        .createTextOutput(p.callback + '(' + body + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
  }

  return out_({ ok: true, msg: '수시 진단 접수함이 살아 있습니다.' });
}

function headers_() {
  return [
    '접수일시', '이름', '연락처', '학교', '학년',
    '내신 국어', '내신 수학', '내신 영어', '내신 탐구', '내신 전교과',
    '모의 국어', '모의 수학', '모의 영어', '모의 탐구1', '모의 탐구2', '수학 선택',
    '추천 전형', '함께 볼 전형', '추천 계열', '대학 라인', '이수 점수', '원서 배분 제안'
  ]
    .concat(TYPE_ORDER.map(function (k) { return '전형 ' + TYPE_LABEL[k]; }))
    .concat(FIELD_ORDER.map(function (k) { return '계열 ' + FIELD_LABEL[k]; }))
    .concat(['원본 답변']);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    var h = headers_();
    sh.appendRow(h);
    sh.getRange(1, 1, 1, h.length).setFontWeight('bold').setBackground('#FDF1E8');
    sh.setFrozenRows(1);
  }
  return sh;
}

function row_(d) {
  var n = d.naesin || {}, m = d.mock || {};
  var ts = d.typeScores || {}, fs = d.fieldScores || {};
  var when = d.submittedAt ? new Date(d.submittedAt) : new Date();
  return [
    Utilities.formatDate(when, 'Asia/Seoul', 'yyyy-MM-dd HH:mm'),
    d.name || '',
    "'" + (d.phone || ''),        // 앞의 작은따옴표가 010 의 0을 지켜 준다
    d.school || '', d.grade || '',
    v_(n.kor), v_(n.math), v_(n.eng), v_(n.inq), v_(n.all),
    v_(m.kor), v_(m.math), v_(m.eng), v_(m.inq1), v_(m.inq2), d.mathChoice || '',
    d.topTypeName || '', d.secondTypeName || '', d.topFieldName || '',
    d.lineName || '', v_(d.credit), d.plan || ''
  ]
    .concat(TYPE_ORDER.map(function (k) { return v_(ts[k]); }))
    .concat(FIELD_ORDER.map(function (k) { return v_(fs[k]); }))
    .concat([JSON.stringify(d.answers || {})]);
}

function notify_(d) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      '[CLS] 수시 진단 접수 · ' + (d.name || '이름 없음'),
      [
        '이름   ' + (d.name || ''),
        '연락처 ' + (d.phone || ''),
        '학교   ' + (d.school || '') + ' ' + (d.grade || ''),
        '',
        '추천 전형 ' + (d.topTypeName || ''),
        '함께 볼 전형 ' + (d.secondTypeName || ''),
        '추천 계열 ' + (d.topFieldName || ''),
        '대학 라인 ' + (d.lineName || ''),
        '원서 배분 ' + (d.plan || '')
      ].join('\n')
    );
  } catch (err) {
    // 메일이 실패해도 접수는 살아 있어야 한다
  }
}

function v_(x) {
  return (x === null || x === undefined || x === '') ? '' : x;
}

function out_(o) {
  return ContentService
    .createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
var SHEET_URL = '';        // ← 여기에 붙여넣기
var SHEET_URL = 'https://script.google.com/macros/s/AKfy……/exec';
var TALLY_BASE = 52;       // 설문을 열기 전까지 학원에서 직접 상담한 학생 수
