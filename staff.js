// ===== staff.js =====
// VexFlow를 사용한 악보 오선지 렌더링

// VexFlow 음표 형식 변환 맵 (과학적 음표 표기 -> VexFlow 키)
const vexFlowNotes = {
    'C4': 'c/4', 'D4': 'd/4', 'E4': 'e/4', 'F4': 'f/4',
    'G4': 'g/4', 'A4': 'a/4', 'B4': 'b/4',
    'C5': 'c/5', 'D5': 'd/5', 'E5': 'e/5', 'F5': 'f/5',
    'G5': 'g/5', 'A5': 'a/5', 'B5': 'b/5'
};

// 줄기 방향 결정
// 규칙: 가운데 줄(B4) 기준
//   - B4 이하 (C4~B4): 줄기 위로 (stem up) = 1
//   - B4 위 (C5~B5): 줄기 아래로 (stem down) = -1
const stemDirections = {
    'C4': 1, 'D4': 1, 'E4': 1, 'F4': 1,
    'G4': 1, 'A4': 1, 'B4': 1,
    'C5': -1, 'D5': -1, 'E5': -1, 'F5': -1,
    'G5': -1, 'A5': -1, 'B5': -1
};

// VexFlow API 참조 가져오기
function getVF() {
    if (typeof Vex !== 'undefined' && Vex.Flow) {
        return Vex.Flow;
    }
    if (typeof VexFlow !== 'undefined') {
        return VexFlow;
    }
    return null;
}

// 오선지 크기 계산
function getStaffDimensions() {
    const container = document.getElementById('staffContainer');
    const containerWidth = container ? container.clientWidth : 600;
    const width = Math.max(400, Math.min(600, containerWidth - 40));
    return { width: width, height: 200 };
}

// 빈 오선지 그리기 (초기 상태)
function initStaff() {
    const VF = getVF();
    if (!VF) {
        console.error('VexFlow를 찾을 수 없습니다');
        return;
    }

    const staffDiv = document.getElementById('staffDiv');
    if (!staffDiv) return;

    staffDiv.innerHTML = '';

    const dim = getStaffDimensions();

    const renderer = new VF.Renderer(staffDiv, VF.Renderer.Backends.SVG);
    renderer.resize(dim.width, dim.height);
    const context = renderer.getContext();

    const staveWidth = dim.width - 20;
    const stave = new VF.Stave(10, 40, staveWidth);
    stave.addClef('treble');
    stave.setContext(context).draw();
}

// 음표가 포함된 오선지 그리기
function renderStaff(noteName) {
    const VF = getVF();
    if (!VF) {
        console.error('VexFlow를 찾을 수 없습니다');
        return;
    }

    const staffDiv = document.getElementById('staffDiv');
    if (!staffDiv) return;

    staffDiv.innerHTML = '';

    const dim = getStaffDimensions();

    const renderer = new VF.Renderer(staffDiv, VF.Renderer.Backends.SVG);
    renderer.resize(dim.width, dim.height);
    const context = renderer.getContext();

    const staveWidth = dim.width - 20;
    const stave = new VF.Stave(10, 40, staveWidth);
    stave.addClef('treble');
    stave.setContext(context).draw();

    if (noteName && vexFlowNotes[noteName]) {
        // 줄기 방향 설정
        const stemDir = stemDirections[noteName] || 1;

        const note = new VF.StaveNote({
            clef: 'treble',
            keys: [vexFlowNotes[noteName]],
            duration: 'q',
            stem_direction: stemDir
        });

        // 보이지 않는 쉼표를 앞에 추가하여 음표를 중앙에 배치
        const ghostBefore = new VF.GhostNote({ duration: 'h' });
        const ghostAfter = new VF.GhostNote({ duration: 'q' });

        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false);
        voice.addTickables([ghostBefore, note, ghostAfter]);

        new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 80);

        voice.draw(context, stave);
    }

    const errorDiv = document.getElementById('errorMsg');
    if (errorDiv) errorDiv.style.display = 'none';
}
