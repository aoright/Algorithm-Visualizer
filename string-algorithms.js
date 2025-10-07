// 字符串算法实现和可视化控制
// 包含KMP、Boyer-Moore、Rabin-Karp等字符串匹配算法的可视化

// 全局变量
let mainText = '';
let patternText = '';
let stringAnimationSpeed = 5;
let isStringRunning = false;
let comparisonCount = 0;
let shiftCount = 0;
let stringStartTime = 0;
let currentStringAlgorithm = 'kmp';

// 初始化字符串页面
function initializeStringPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateStringAlgorithm);
    document.getElementById('speed').addEventListener('input', updateStringSpeed);
    document.getElementById('generateExample').addEventListener('click', generateStringExample);
    document.getElementById('startSearch').addEventListener('click', startStringSearch);
    document.getElementById('stopSearch').addEventListener('click', stopStringSearch);
    
    // 初始化显示
    generateStringExample();
    updateStringAlgorithm();
}

// 更新字符串算法
function updateStringAlgorithm() {
    currentStringAlgorithm = document.getElementById('algorithmSelect').value;
    updateStringInfo();
}

// 更新字符串速度
function updateStringSpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    stringAnimationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = stringAnimationSpeed;
}

// 生成字符串示例
function generateStringExample() {
    if (isStringRunning) return;
    
    const examples = {
        kmp: {
            text: 'ABABCABCACBAB',
            pattern: 'ABCAC'
        },
        'boyer-moore': {
            text: 'HERE IS A SIMPLE EXAMPLE',
            pattern: 'EXAMPLE'
        },
        'rabin-karp': {
            text: '314159265358979323846264338327950288419716939937',
            pattern: '26433'
        },
        naive: {
            text: 'ABABDABACDABABCABCACBAB',
            pattern: 'ABABC'
        }
    };
    
    const example = examples[currentStringAlgorithm];
    if (example) {
        document.getElementById('mainText').value = example.text;
        document.getElementById('patternText').value = example.pattern;
        
        mainText = example.text;
        patternText = example.pattern;
    } else {
        mainText = document.getElementById('mainText').value || 'ABABCABCACBAB';
        patternText = document.getElementById('patternText').value || 'ABCAC';
    }
    
    displayStrings();
    resetStringStatistics();
    clearStringSteps();
}

// 显示字符串
function displayStrings() {
    // 显示主文本
    const mainTextDisplay = document.getElementById('mainTextDisplay');
    mainTextDisplay.innerHTML = '';
    
    for (let i = 0; i < mainText.length; i++) {
        const charElement = document.createElement('div');
        charElement.className = 'string-char';
        charElement.id = `text-${i}`;
        charElement.textContent = mainText[i];
        
        // 添加索引
        const indexElement = document.createElement('div');
        indexElement.className = 'string-index';
        indexElement.textContent = i;
        charElement.appendChild(indexElement);
        
        mainTextDisplay.appendChild(charElement);
    }
    
    // 显示模式串
    const patternDisplay = document.getElementById('patternDisplay');
    patternDisplay.innerHTML = '';
    
    for (let i = 0; i < patternText.length; i++) {
        const charElement = document.createElement('div');
        charElement.className = 'pattern-char';
        charElement.id = `pattern-${i}`;
        charElement.textContent = patternText[i];
        patternDisplay.appendChild(charElement);
    }
    
    // 更新统计信息
    document.getElementById('textLength').textContent = mainText.length;
    document.getElementById('patternLength').textContent = patternText.length;
}

// 开始字符串搜索
async function startStringSearch() {
    if (isStringRunning) return;
    
    mainText = document.getElementById('mainText').value;
    patternText = document.getElementById('patternText').value;
    
    if (!mainText || !patternText) {
        alert('请输入主文本和模式串！');
        return;
    }
    
    if (patternText.length > mainText.length) {
        alert('模式串长度不能超过主文本长度！');
        return;
    }
    
    isStringRunning = true;
    stringStartTime = Date.now();
    comparisonCount = 0;
    shiftCount = 0;
    
    // 禁用控制按钮
    document.getElementById('startSearch').disabled = true;
    document.getElementById('generateExample').disabled = true;
    
    // 清除之前的结果
    clearStringSteps();
    resetStringDisplay();
    
    try {
        let result = -1;
        
        switch (currentStringAlgorithm) {
            case 'kmp':
                result = await kmpVisualization(mainText, patternText);
                break;
            case 'boyer-moore':
                result = await boyerMooreVisualization(mainText, patternText);
                break;
            case 'rabin-karp':
                result = await rabinKarpVisualization(mainText, patternText);
                break;
            case 'naive':
                result = await naiveVisualization(mainText, patternText);
                break;
        }
        
        // 更新搜索结果
        updateSearchResult(result);
        
    } catch (error) {
        console.error('字符串搜索过程中出现错误:', error);
    } finally {
        isStringRunning = false;
        
        // 重新启用控制按钮
        document.getElementById('startSearch').disabled = false;
        document.getElementById('generateExample').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - stringStartTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// 停止字符串搜索
function stopStringSearch() {
    isStringRunning = false;
    document.getElementById('startSearch').disabled = false;
    document.getElementById('generateExample').disabled = false;
}

// KMP算法可视化
async function kmpVisualization(text, pattern) {
    addStringStep('开始KMP算法，构建LPS数组...');
    
    // 构建LPS数组
    const lps = await buildLPSArray(pattern);
    displayLPSArray(lps);
    
    addStringStep('LPS数组构建完成，开始搜索...');
    
    let i = 0; // 主文本索引
    let j = 0; // 模式串索引
    
    while (i < text.length && isStringRunning) {
        addStringStep(`比较 text[${i}]='${text[i]}' 和 pattern[${j}]='${pattern[j]}'`);
        
        // 高亮当前比较位置
        highlightTextPosition(i, 'matching');
        highlightPatternPosition(j, 'current');
        
        comparisonCount++;
        updateStringStatistics();
        
        await sleep(getStringAnimationDelay());
        
        if (text[i] === pattern[j]) {
            addStringStep(`字符匹配！i=${i}, j=${j} 都向前移动`);
            
            i++;
            j++;
            
            if (j === pattern.length) {
                addStringStep(`找到匹配！位置: ${i - j}`);
                return i - j;
            }
        } else {
            if (j !== 0) {
                addStringStep(`字符不匹配，使用LPS值跳过: j = ${lps[j-1]}`);
                j = lps[j - 1];
                shiftCount++;
            } else {
                addStringStep(`字符不匹配且j=0，i向前移动`);
                i++;
            }
        }
        
        // 重置高亮
        resetTextHighlights();
        resetPatternHighlights();
        
        await sleep(getStringAnimationDelay());
    }
    
    addStringStep('搜索完成，未找到匹配');
    return -1;
}

// 构建LPS数组
async function buildLPSArray(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;
    
    addStringStep('构建LPS数组...');
    
    while (i < pattern.length && isStringRunning) {
        addStringStep(`LPS[${i}]: 比较 pattern[${len}]='${pattern[len]}' 和 pattern[${i}]='${pattern[i]}'`);
        
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            addStringStep(`字符匹配，LPS[${i}] = ${len}`);
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
                addStringStep(`字符不匹配，len = LPS[${len}] = ${len}`);
            } else {
                lps[i] = 0;
                addStringStep(`字符不匹配且len=0，LPS[${i}] = 0`);
                i++;
            }
        }
        
        // 高亮当前LPS计算
        const lpsCell = document.getElementById(`lps-${i-1}`);
        if (lpsCell) {
            lpsCell.textContent = lps[i-1];
            lpsCell.className = 'lps-cell computed';
        }
        
        await sleep(getStringAnimationDelay());
    }
    
    return lps;
}

// Boyer-Moore算法可视化
async function boyerMooreVisualization(text, pattern) {
    addStringStep('开始Boyer-Moore算法，构建坏字符表...');
    
    // 构建坏字符表
    const badChar = buildBadCharTable(pattern);
    
    addStringStep('坏字符表构建完成，开始搜索...');
    
    let i = 0; // 模式串在主文本中的起始位置
    
    while (i <= text.length - pattern.length && isStringRunning) {
        let j = pattern.length - 1; // 从模式串末尾开始比较
        
        addStringStep(`从位置 ${i} 开始比较，j = ${j}`);
        
        while (j >= 0 && isStringRunning) {
            addStringStep(`比较 text[${i + j}]='${text[i + j]}' 和 pattern[${j}]='${pattern[j]}'`);
            
            // 高亮当前比较位置
            highlightTextPosition(i + j, 'matching');
            highlightPatternPosition(j, 'current');
            
            comparisonCount++;
            updateStringStatistics();
            
            await sleep(getStringAnimationDelay());
            
            if (text[i + j] === pattern[j]) {
                addStringStep(`字符匹配，j = ${j - 1}`);
                j--;
            } else {
                addStringStep(`字符不匹配，使用坏字符规则`);
                
                const badCharShift = badChar[text[i + j]] || -1;
                const shift = Math.max(1, j - badCharShift);
                
                addStringStep(`移动 ${shift} 个位置`);
                i += shift;
                shiftCount++;
                
                // 显示移动
                showShiftIndicator(i, shift);
                
                break;
            }
            
            // 重置高亮
            resetTextHighlights();
            resetPatternHighlights();
            
            await sleep(getStringAnimationDelay());
        }
        
        if (j < 0) {
            addStringStep(`找到匹配！位置: ${i}`);
            return i;
        }
    }
    
    addStringStep('搜索完成，未找到匹配');
    return -1;
}

// 构建坏字符表
function buildBadCharTable(pattern) {
    const badChar = {};
    
    for (let i = 0; i < pattern.length; i++) {
        badChar[pattern[i]] = i;
    }
    
    return badChar;
}

// Rabin-Karp算法可视化
async function rabinKarpVisualization(text, pattern) {
    addStringStep('开始Rabin-Karp算法，计算哈希值...');
    
    const base = 256; // 字符集大小
    const prime = 101; // 质数
    
    const patternHash = calculateHash(pattern, base, prime);
    let textHash = calculateHash(text.substring(0, pattern.length), base, prime);
    
    addStringStep(`模式串哈希值: ${patternHash}`);
    addStringStep(`初始文本哈希值: ${textHash}`);
    
    const highestPower = Math.pow(base, pattern.length - 1) % prime;
    
    for (let i = 0; i <= text.length - pattern.length && isStringRunning; i++) {
        addStringStep(`检查位置 ${i}，哈希值: ${textHash}`);
        
        if (textHash === patternHash) {
            addStringStep(`哈希值匹配，验证字符串...`);
            
            let match = true;
            for (let j = 0; j < pattern.length && isStringRunning; j++) {
                comparisonCount++;
                updateStringStatistics();
                
                highlightTextPosition(i + j, 'matching');
                highlightPatternPosition(j, 'current');
                
                await sleep(getStringAnimationDelay());
                
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    addStringStep(`字符不匹配，哈希冲突！`);
                    break;
                }
                
                resetTextHighlights();
                resetPatternHighlights();
            }
            
            if (match) {
                addStringStep(`找到匹配！位置: ${i}`);
                return i;
            }
        }
        
        if (i < text.length - pattern.length) {
            // 滚动哈希
            textHash = (textHash - text.charCodeAt(i) * highestPower + prime) % prime;
            textHash = (textHash * base + text.charCodeAt(i + pattern.length)) % prime;
            
            addStringStep(`滚动哈希到位置 ${i + 1}，新哈希值: ${textHash}`);
            shiftCount++;
        }
        
        await sleep(getStringAnimationDelay());
    }
    
    addStringStep('搜索完成，未找到匹配');
    return -1;
}

// 计算哈希值
function calculateHash(str, base, prime) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * base + str.charCodeAt(i)) % prime;
    }
    return hash;
}

// 朴素匹配算法可视化
async function naiveVisualization(text, pattern) {
    addStringStep('开始朴素字符串匹配算法...');
    
    for (let i = 0; i <= text.length - pattern.length && isStringRunning; i++) {
        addStringStep(`从位置 ${i} 开始比较`);
        
        let j = 0;
        while (j < pattern.length && isStringRunning) {
            addStringStep(`比较 text[${i + j}]='${text[i + j]}' 和 pattern[${j}]='${pattern[j]}'`);
            
            // 高亮当前比较位置
            highlightTextPosition(i + j, 'matching');
            highlightPatternPosition(j, 'current');
            
            comparisonCount++;
            updateStringStatistics();
            
            await sleep(getStringAnimationDelay());
            
            if (text[i + j] === pattern[j]) {
                addStringStep(`字符匹配，j = ${j + 1}`);
                j++;
            } else {
                addStringStep(`字符不匹配，移动到位置 ${i + 1}`);
                shiftCount++;
                break;
            }
            
            // 重置高亮
            resetTextHighlights();
            resetPatternHighlights();
            
            await sleep(getStringAnimationDelay());
        }
        
        if (j === pattern.length) {
            addStringStep(`找到匹配！位置: ${i}`);
            return i;
        }
    }
    
    addStringStep('搜索完成，未找到匹配');
    return -1;
}

// 显示LPS数组
function displayLPSArray(lps) {
    const container = document.getElementById('auxiliaryDisplay');
    container.innerHTML = `
        <h4 class="font-semibold mb-3 text-gray-300">LPS数组（最长前缀后缀）</h4>
        <div class="lps-array">
            ${lps.map((val, i) => 
                `<div class="lps-cell" id="lps-${i}">${val}</div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400 mt-2">LPS[i]表示模式串[0..i]的最长相等前后缀长度</p>
    `;
}

// 高亮文本位置
function highlightTextPosition(index, className) {
    const element = document.getElementById(`text-${index}`);
    if (element) {
        element.className = `string-char ${className}`;
    }
}

// 高亮模式串位置
function highlightPatternPosition(index, className) {
    const element = document.getElementById(`pattern-${index}`);
    if (element) {
        element.className = `pattern-char ${className}`;
    }
}

// 重置文本高亮
function resetTextHighlights() {
    for (let i = 0; i < mainText.length; i++) {
        const element = document.getElementById(`text-${i}`);
        if (element) {
            element.className = 'string-char';
        }
    }
}

// 重置模式串高亮
function resetPatternHighlights() {
    for (let i = 0; i < patternText.length; i++) {
        const element = document.getElementById(`pattern-${i}`);
        if (element) {
            element.className = 'pattern-char';
        }
    }
}

// 显示移动指示器
function showShiftIndicator(position, shift) {
    // 这里可以添加移动指示器的可视化
    addStringStep(`移动到位置 ${position} (移动了 ${shift} 个位置)`);
}

// 更新搜索结果
function updateSearchResult(position) {
    const status = document.getElementById('searchStatus');
    const matchPosition = document.getElementById('matchPosition');
    
    if (position !== -1) {
        status.textContent = '已找到';
        status.className = 'text-green-400';
        matchPosition.textContent = position;
        
        // 高亮找到的匹配
        for (let i = 0; i < patternText.length; i++) {
            highlightTextPosition(position + i, 'matched');
        }
    } else {
        status.textContent = '未找到';
        status.className = 'text-red-400';
        matchPosition.textContent = '-1';
    }
}

// 更新字符串算法信息
function updateStringInfo() {
    const algorithmInfo = {
        kmp: {
            bestCase: 'O(n+m)',
            averageCase: 'O(n+m)',
            worstCase: 'O(n+m)',
            preprocessing: 'O(m)'
        },
        'boyer-moore': {
            bestCase: 'O(n/m)',
            averageCase: 'O(n)',
            worstCase: 'O(n×m)',
            preprocessing: 'O(m + k)'
        },
        'rabin-karp': {
            bestCase: 'O(n+m)',
            averageCase: 'O(n+m)',
            worstCase: 'O(n×m)',
            preprocessing: 'O(m)'
        },
        naive: {
            bestCase: 'O(n)',
            averageCase: 'O(n×m)',
            worstCase: 'O(n×m)',
            preprocessing: 'O(1)'
        }
    };
    
    const info = algorithmInfo[currentStringAlgorithm];
    if (info) {
        document.getElementById('bestCase').textContent = info.bestCase;
        document.getElementById('averageCase').textContent = info.averageCase;
        document.getElementById('worstCase').textContent = info.worstCase;
        document.getElementById('preprocessing').textContent = info.preprocessing;
    }
    
    // 更新代码显示
    updateAlgorithmCode();
}

// 更新算法代码
function updateAlgorithmCode() {
    const codeElement = document.getElementById('algorithmCode');
    
    const codes = {
        kmp: `function kmpSearch(text, pattern) {
    // 构建LPS数组
    const lps = buildLPSArray(pattern);
    
    let i = 0, j = 0;
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
            if (j === pattern.length) {
                return i - j; // 找到匹配
            }
        } else {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return -1; // 未找到
}`,
        'boyer-moore': `function boyerMooreSearch(text, pattern) {
    const badChar = buildBadCharTable(pattern);
    
    let i = 0;
    while (i <= text.length - pattern.length) {
        let j = pattern.length - 1;
        
        while (j >= 0 && text[i + j] === pattern[j]) {
            j--;
        }
        
        if (j < 0) {
            return i; // 找到匹配
        } else {
            const shift = Math.max(1, j - (badChar[text[i + j]] || -1));
            i += shift;
        }
    }
    return -1; // 未找到
}`,
        'rabin-karp': `function rabinKarpSearch(text, pattern) {
    const base = 256;
    const prime = 101;
    
    const patternHash = calculateHash(pattern, base, prime);
    let textHash = calculateHash(text.substring(0, pattern.length), base, prime);
    
    const highestPower = Math.pow(base, pattern.length - 1) % prime;
    
    for (let i = 0; i <= text.length - pattern.length; i++) {
        if (textHash === patternHash) {
            // 验证匹配
            if (text.substring(i, i + pattern.length) === pattern) {
                return i;
            }
        }
        
        // 滚动哈希
        if (i < text.length - pattern.length) {
            textHash = (textHash - text.charCodeAt(i) * highestPower + prime) % prime;
            textHash = (textHash * base + text.charCodeAt(i + pattern.length)) % prime;
        }
    }
    return -1;
}`,
        naive: `function naiveSearch(text, pattern) {
    for (let i = 0; i <= text.length - pattern.length; i++) {
        let j = 0;
        
        while (j < pattern.length && text[i + j] === pattern[j]) {
            j++;
        }
        
        if (j === pattern.length) {
            return i; // 找到匹配
        }
    }
    return -1; // 未找到
}`
    };
    
    codeElement.textContent = codes[currentStringAlgorithm] || '// 选择算法查看代码实现';
}

// 添加算法步骤
function addStringStep(step) {
    const stepsContainer = document.getElementById('algorithmSteps');
    const stepElement = document.createElement('div');
    stepElement.className = 'step-indicator';
    stepElement.innerHTML = `<span class="text-gray-300">${step}</span>`;
    
    stepsContainer.appendChild(stepElement);
    
    // 自动滚动到底部
    stepsContainer.scrollTop = stepsContainer.scrollHeight;
    
    // 限制步骤数量
    if (stepsContainer.children.length > 50) {
        stepsContainer.removeChild(stepsContainer.firstChild);
    }
}

// 清除算法步骤
function clearStringSteps() {
    const stepsContainer = document.getElementById('algorithmSteps');
    stepsContainer.innerHTML = '<div class="text-gray-400">点击"开始搜索"查看详细的算法执行步骤...</div>';
}

// 更新字符串统计信息
function updateStringStatistics() {
    document.getElementById('comparisonCount').textContent = comparisonCount;
    document.getElementById('shiftCount').textContent = shiftCount;
}

// 重置字符串统计信息
function resetStringStatistics() {
    document.getElementById('comparisonCount').textContent = '0';
    document.getElementById('shiftCount').textContent = '0';
    document.getElementById('matchPosition').textContent = '-1';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('searchStatus').textContent = '就绪';
    document.getElementById('searchStatus').className = 'text-gray-400';
}

// 重置字符串显示
function resetStringDisplay() {
    resetTextHighlights();
    resetPatternHighlights();
}

// 获取字符串动画延迟
function getStringAnimationDelay() {
    return Math.max(100, 1200 - stringAnimationSpeed * 100);
}

// 工具函数：睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出函数供其他文件使用
window.StringAlgorithms = {
    initializeStringPage,
    startStringSearch,
    stopStringSearch
};