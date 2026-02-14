// ===== staff.js =====
// VexFlow를 사용한 악보 오선지 렌더링

// 현재 자리표 ('treble' 또는 'bass')
let currentStaffClef = 'treble';

function setStaffClef(clef) {
    currentStaffClef = clef;
}

// VexFlow 음표 형식 변환 맵 (자연음 + 샵/플랫, 옥타브 1~6)
const vexFlowNotes = {
    // 옥타브 1
    'C1': 'c/1', 'D1': 'd/1', 'E1': 'e/1', 'F1': 'f/1',
    'G1': 'g/1', 'A1': 'a/1', 'B1': 'b/1',
    // 옥타브 2
    'C2': 'c/2', 'D2': 'd/2', 'E2': 'e/2', 'F2': 'f/2',
    'G2': 'g/2', 'A2': 'a/2', 'B2': 'b/2',
    // 옥타브 3
    'C3': 'c/3', 'D3': 'd/3', 'E3': 'e/3', 'F3': 'f/3',
    'G3': 'g/3', 'A3': 'a/3', 'B3': 'b/3',
    // 옥타브 4
    'C4': 'c/4', 'D4': 'd/4', 'E4': 'e/4', 'F4': 'f/4',
    'G4': 'g/4', 'A4': 'a/4', 'B4': 'b/4',
    // 옥타브 5
    'C5': 'c/5', 'D5': 'd/5', 'E5': 'e/5', 'F5': 'f/5',
    'G5': 'g/5', 'A5': 'a/5', 'B5': 'b/5',
    // 옥타브 6
    'C6': 'c/6', 'D6': 'd/6', 'E6': 'e/6', 'F6': 'f/6',
    'G6': 'g/6', 'A6': 'a/6', 'B6': 'b/6',
    // 샵 옥타브 1
    'C#1': 'c#/1', 'D#1': 'd#/1', 'F#1': 'f#/1', 'G#1': 'g#/1', 'A#1': 'a#/1',
    // 샵 옥타브 2
    'C#2': 'c#/2', 'D#2': 'd#/2', 'F#2': 'f#/2', 'G#2': 'g#/2', 'A#2': 'a#/2',
    // 샵 옥타브 3
    'C#3': 'c#/3', 'D#3': 'd#/3', 'F#3': 'f#/3', 'G#3': 'g#/3', 'A#3': 'a#/3',
    // 샵 옥타브 4
    'C#4': 'c#/4', 'D#4': 'd#/4', 'F#4': 'f#/4', 'G#4': 'g#/4', 'A#4': 'a#/4',
    // 샵 옥타브 5
    'C#5': 'c#/5', 'D#5': 'd#/5', 'F#5': 'f#/5', 'G#5': 'g#/5', 'A#5': 'a#/5',
    // 샵 옥타브 6
    'C#6': 'c#/6', 'D#6': 'd#/6', 'F#6': 'f#/6', 'G#6': 'g#/6', 'A#6': 'a#/6',
    // 플랫 옥타브 1
    'Db1': 'db/1', 'Eb1': 'eb/1', 'Gb1': 'gb/1', 'Ab1': 'ab/1', 'Bb1': 'bb/1',
    // 플랫 옥타브 2
    'Db2': 'db/2', 'Eb2': 'eb/2', 'Gb2': 'gb/2', 'Ab2': 'ab/2', 'Bb2': 'bb/2',
    // 플랫 옥타브 3
    'Db3': 'db/3', 'Eb3': 'eb/3', 'Gb3': 'gb/3', 'Ab3': 'ab/3', 'Bb3': 'bb/3',
    // 플랫 옥타브 4
    'Db4': 'db/4', 'Eb4': 'eb/4', 'Gb4': 'gb/4', 'Ab4': 'ab/4', 'Bb4': 'bb/4',
    // 플랫 옥타브 5
    'Db5': 'db/5', 'Eb5': 'eb/5', 'Gb5': 'gb/5', 'Ab5': 'ab/5', 'Bb5': 'bb/5',
    // 플랫 옥타브 6
    'Db6': 'db/6', 'Eb6': 'eb/6', 'Gb6': 'gb/6', 'Ab6': 'ab/6', 'Bb6': 'bb/6'
};

// 임시표(accidental) 정보
const noteAccidentals = {
    'C#1': '#', 'D#1': '#', 'F#1': '#', 'G#1': '#', 'A#1': '#',
    'C#2': '#', 'D#2': '#', 'F#2': '#', 'G#2': '#', 'A#2': '#',
    'C#3': '#', 'D#3': '#', 'F#3': '#', 'G#3': '#', 'A#3': '#',
    'C#4': '#', 'D#4': '#', 'F#4': '#', 'G#4': '#', 'A#4': '#',
    'C#5': '#', 'D#5': '#', 'F#5': '#', 'G#5': '#', 'A#5': '#',
    'C#6': '#', 'D#6': '#', 'F#6': '#', 'G#6': '#', 'A#6': '#',
    'Db1': 'b', 'Eb1': 'b', 'Gb1': 'b', 'Ab1': 'b', 'Bb1': 'b',
    'Db2': 'b', 'Eb2': 'b', 'Gb2': 'b', 'Ab2': 'b', 'Bb2': 'b',
    'Db3': 'b', 'Eb3': 'b', 'Gb3': 'b', 'Ab3': 'b', 'Bb3': 'b',
    'Db4': 'b', 'Eb4': 'b', 'Gb4': 'b', 'Ab4': 'b', 'Bb4': 'b',
    'Db5': 'b', 'Eb5': 'b', 'Gb5': 'b', 'Ab5': 'b', 'Bb5': 'b',
    'Db6': 'b', 'Eb6': 'b', 'Gb6': 'b', 'Ab6': 'b', 'Bb6': 'b'
};

// 음표 표시 이름 (옥타브 제외)
function getDisplayName(noteName) {
    return noteName.replace(/[0-9]/g, '');
}

// 줄기 방향 결정
// 높은음자리표: B4 기준 (B4이하 위로, C5이상 아래로)
// 낮은음자리표: D3 기준 (D3이하 위로, E3이상 아래로)
function getStemDirection(noteName) {
    const letter = noteName.charAt(0);
    const octave = parseInt(noteName.replace(/[^0-9]/g, '')) || 4;

    if (currentStaffClef === 'bass') {
        // 낮은음자리표: D3이 중간선
        if (octave < 3) return 1;
        if (octave > 3) return -1;
        // 옥타브 3: D3까지 위로, E3부터 아래로
        return ['C', 'D'].includes(letter) ? 1 : -1;
    } else {
        // 높은음자리표: B4가 중간선
        if (octave >= 5) return -1;
        if (octave <= 3) return 1;
        return 1; // 옥타브 4: 위로
    }
}

// 이전 음 히스토리 (최대 2개)
const MAX_HISTORY = 2;
let noteHistory = [];

// VexFlow API 참조
function getVF() {
    if (typeof Vex !== 'undefined' && Vex.Flow) return Vex.Flow;
    if (typeof VexFlow !== 'undefined') return VexFlow;
    return null;
}

// 오선지 크기 계산 (컨테이너에 맞춤)
function getStaffDimensions() {
    const container = document.getElementById('staffContainer');
    const containerWidth = container ? container.clientWidth : 600;
    const containerHeight = container ? container.clientHeight : 300;

    // 컨테이너 크기에서 패딩 빼기
    const availW = Math.max(300, containerWidth - 10);
    const availH = Math.max(150, containerHeight - 10);

    // 스케일: 오선지 세로 간격을 보기 좋게 유지
    // 기본 오선 영역은 약 80px (unscaled), 위아래 여유 포함 ~120px
    const idealScale = Math.min(availH / 130, availW / 260);
    const scale = Math.max(1.2, Math.min(3.2, idealScale));

    return { width: availW, height: availH, scale: scale };
}

// 히스토리 초기화
function clearNoteHistory() {
    noteHistory = [];
}

// 히스토리에 음 추가
function addToHistory(noteName, color) {
    noteHistory.push({ note: noteName, color: color });
    if (noteHistory.length > MAX_HISTORY) {
        noteHistory.shift();
    }
}

// VexFlow StaveNote 생성 헬퍼
function createStaveNote(VF, noteName, stemDir, showLabel) {
    const vexKey = vexFlowNotes[noteName];
    if (!vexKey) return null;

    const note = new VF.StaveNote({
        clef: currentStaffClef,
        keys: [vexKey],
        duration: 'q',
        stem_direction: stemDir
    });

    // 임시표(샵/플랫) 추가
    try {
        const acc = noteAccidentals[noteName];
        if (acc && VF.Accidental) {
            note.addModifier(new VF.Accidental(acc), 0);
        }
    } catch (e) {
        console.warn('Accidental 추가 실패:', e);
    }

    // 음이름 라벨 추가
    if (showLabel) {
        try {
            const label = getDisplayName(noteName);
            const annotation = new VF.Annotation(label);
            annotation.setFont('Arial', 11, 'bold');
            if (VF.Annotation.VerticalJustify) {
                annotation.setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM);
            } else {
                annotation.setVerticalJustification(4); // BOTTOM fallback
            }
            note.addModifier(annotation, 0);
        } catch (e) {
            console.warn('Annotation 추가 실패:', e);
        }
    }

    return note;
}

// 오선 Y위치 계산 (위쪽으로 올려서 아래 레저라인 공간 확보)
function getStaveY(dim) {
    const sc = dim.scale || 1;
    const scaledAreaH = dim.height / sc;
    const staveH = 80;
    // 중앙보다 위쪽에 배치하여 아래 레저라인(낮은 음표) 공간 확보
    const y = Math.max(3, (scaledAreaH - staveH) / 2 - 25);
    return y;
}

// 빈 오선지 그리기
function initStaff() {
    const VF = getVF();
    if (!VF) return;

    const staffDiv = document.getElementById('staffDiv');
    if (!staffDiv) return;

    staffDiv.innerHTML = '';
    clearNoteHistory();

    const dim = getStaffDimensions();
    const sc = dim.scale || 1;
    const renderer = new VF.Renderer(staffDiv, VF.Renderer.Backends.SVG);
    renderer.resize(dim.width, dim.height);
    const context = renderer.getContext();
    context.scale(sc, sc);

    const staveWidth = (dim.width / sc) - 20;
    const staveY = getStaveY(dim);
    const stave = new VF.Stave(10, staveY, staveWidth);
    stave.addClef(currentStaffClef);
    stave.setContext(context).draw();
}

// 히스토리 + 현재 음표 렌더링
// wrongNote: 틀렸을 때 사용자가 누른 음표 (빨간색으로 표시)
function renderStaff(currentNote, feedbackNote, feedbackColor, wrongNote) {
    const VF = getVF();
    if (!VF) {
        console.error('VexFlow를 찾을 수 없습니다');
        return;
    }

    const staffDiv = document.getElementById('staffDiv');
    if (!staffDiv) return;
    staffDiv.innerHTML = '';

    const dim = getStaffDimensions();
    const sc = dim.scale || 1;
    const renderer = new VF.Renderer(staffDiv, VF.Renderer.Backends.SVG);
    renderer.resize(dim.width, dim.height);
    const context = renderer.getContext();
    context.scale(sc, sc);

    const staveWidth = (dim.width / sc) - 20;
    const staveY = getStaveY(dim);
    const stave = new VF.Stave(10, staveY, staveWidth);
    stave.addClef(currentStaffClef);
    stave.setContext(context).draw();

    try {
        const tickables = [];
        const hasWrong = wrongNote && vexFlowNotes[wrongNote];
        const totalSlots = MAX_HISTORY + 2; // 히스토리 + 현재 + 여백
        const usedSlots = noteHistory.length + 1;

        // 앞에 빈칸 채우기
        const emptySlots = Math.max(0, totalSlots - usedSlots - 1);
        for (let i = 0; i < emptySlots; i++) {
            tickables.push(new VF.GhostNote({ duration: 'q' }));
        }

        // 히스토리 음표 (왼쪽, 점점 흐려짐)
        noteHistory.forEach((item, idx) => {
            const stemDir = getStemDirection(item.note);
            const histNote = createStaveNote(VF, item.note, stemDir, true);
            if (!histNote) return;

            const opacity = 0.3 + (idx / Math.max(noteHistory.length, 1)) * 0.4;
            const colorMap = { 'blue': '#2196F3', 'red': '#F44336' };
            const baseColor = colorMap[item.color] || '#999';
            const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
            const fadedColor = baseColor + alpha;

            histNote.setStyle({ fillStyle: fadedColor, strokeStyle: fadedColor });
            tickables.push(histNote);
        });

        // 현재 음표 (정답)
        if (currentNote && vexFlowNotes[currentNote]) {
            const stemDir = getStemDirection(currentNote);
            const showLabel = !!feedbackColor;
            const mainNote = createStaveNote(VF, currentNote, stemDir, showLabel);

            if (mainNote) {
                if (feedbackColor) {
                    const colorMap = { 'blue': '#2196F3', 'red': '#F44336' };
                    let c;
                    if (hasWrong) {
                        c = '#2196F3'; // 틀렸을 때 정답은 항상 파란색
                    } else {
                        c = colorMap[feedbackColor] || '#333';
                    }
                    mainNote.setStyle({ fillStyle: c, strokeStyle: c });
                }
                tickables.push(mainNote);
            }
        }

        // 뒤에 여백
        tickables.push(new VF.GhostNote({ duration: 'q' }));

        // 메인 보이스
        const voice1 = new VF.Voice({
            num_beats: tickables.length,
            beat_value: 4
        });
        voice1.setStrict(false);
        voice1.addTickables(tickables);

        // 틀린 음표를 두 번째 보이스로 (같은 x 위치에 겹침)
        if (hasWrong) {
            const wrongTickables = [];
            // 정답 음표와 같은 위치에 오도록 앞을 GhostNote로 채움
            for (let i = 0; i < tickables.length - 2; i++) {
                wrongTickables.push(new VF.GhostNote({ duration: 'q' }));
            }
            // 틀린 음표 (빨간색)
            const wrongStemDir = getStemDirection(wrongNote);
            const wrongStaveNote = createStaveNote(VF, wrongNote, wrongStemDir, true);
            if (wrongStaveNote) {
                const wrongColor = '#F44336';
                wrongStaveNote.setStyle({ fillStyle: wrongColor, strokeStyle: wrongColor });
                wrongTickables.push(wrongStaveNote);
            }
            // 뒤에 여백
            wrongTickables.push(new VF.GhostNote({ duration: 'q' }));

            const voice2 = new VF.Voice({
                num_beats: wrongTickables.length,
                beat_value: 4
            });
            voice2.setStrict(false);
            voice2.addTickables(wrongTickables);

            new VF.Formatter().joinVoices([voice1]).joinVoices([voice2]).format([voice1, voice2], staveWidth - 80);
            voice1.draw(context, stave);
            voice2.draw(context, stave);
        } else {
            new VF.Formatter().joinVoices([voice1]).format([voice1], staveWidth - 80);
            voice1.draw(context, stave);
        }
    } catch (e) {
        console.error('renderStaff 오류:', e);
    }

    const errorDiv = document.getElementById('errorMsg');
    if (errorDiv) errorDiv.style.display = 'none';
}
