// 动态规划算法实现和可视化控制
// 包含斐波那契数列、背包问题、最长公共子序列等DP算法的可视化

// 全局变量
let dpTable = [];
let dpProblemSize = 10;
let dpAnimationSpeed = 5;
let isDPRunning = false;
let computationCount = 0;
let dpStartTime = 0;
let currentDPAlgorithm = 'fibonacci';

// 问题特定数据
let fibSequence = [];
let knapsackItems = [];
let knapsackCapacity = 20;
let lcsString1 = '';
let lcsString2 = '';
let lisArray = [];

// 初始化DP页面
function initializeDPPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateDPAlgorithm);
    document.getElementById('problemSize').addEventListener('input', updateProblemSize);
    document.getElementById('knapsackCapacity').addEventListener('input', updateKnapsackCapacity);
    document.getElementById('speed').addEventListener('input', updateDPSpeed);
    document.getElementById('generateProblem').addEventListener('click', generateDPProblem);
    document.getElementById('startDP').addEventListener('click', startDPSolution);
    document.getElementById('stopDP').addEventListener('click', stopDPSolution);
    
    // 初始化问题
    generateDPProblem();
    updateDPAlgorithm();
}

// 更新DP算法
function updateDPAlgorithm() {
    currentDPAlgorithm = document.getElementById('algorithmSelect').value;
    
    // 显示/隐藏特定参数
    const additionalParams = document.getElementById('additionalParams');
    if (currentDPAlgorithm === 'knapsack') {
        additionalParams.style.display = 'block';
    } else {
        additionalParams.style.display = 'none';
    }
    
    generateDPProblem();
    updateDPInfo();
}

// 更新问题规模
function updateProblemSize() {
    const sizeSlider = document.getElementById('problemSize');
    const sizeValue = document.getElementById('problemSizeValue');
    
    dpProblemSize = parseInt(sizeSlider.value);
    sizeValue.textContent = dpProblemSize;
    
    generateDPProblem();
}

// 更新背包容量
function updateKnapsackCapacity() {
    const capacitySlider = document.getElementById('knapsackCapacity');
    const capacityValue = document.getElementById('knapsackCapacityValue');
    
    knapsackCapacity = parseInt(capacitySlider.value);
    capacityValue.textContent = knapsackCapacity;
    
    if (currentDPAlgorithm === 'knapsack') {
        generateDPProblem();
    }
}

// 更新DP速度
function updateDPSpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    dpAnimationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = dpAnimationSpeed;
}

// 生成DP问题
function generateDPProblem() {
    if (isDPRunning) return;
    
    switch (currentDPAlgorithm) {
        case 'fibonacci':
            generateFibonacciProblem();
            break;
        case 'knapsack':
            generateKnapsackProblem();
            break;
        case 'lcs':
            generateLCSProblem();
            break;
        case 'lis':
            generateLISProblem();
            break;
    }
    
    resetDPStatistics();
    clearDPSteps();
}

// 生成斐波那契问题
function generateFibonacciProblem() {
    fibSequence = [0, 1];
    for (let i = 2; i <= dpProblemSize; i++) {
        fibSequence[i] = fibSequence[i-1] + fibSequence[i-2];
    }
    
    displayFibonacciProblem();
}

// 生成背包问题
function generateKnapsackProblem() {
    knapsackItems = [];
    const itemCount = Math.min(dpProblemSize, 8); // 限制物品数量以便可视化
    
    for (let i = 0; i < itemCount; i++) {
        knapsackItems.push({
            id: i,
            weight: Math.floor(Math.random() * 10) + 1,
            value: Math.floor(Math.random() * 20) + 5,
            name: `物品${i+1}`
        });
    }
    
    displayKnapsackProblem();
}

// 生成LCS问题
function generateLCSProblem() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    lcsString1 = '';
    lcsString2 = '';
    
    const len1 = Math.floor(dpProblemSize / 2) + 2;
    const len2 = Math.floor(dpProblemSize / 2) + 1;
    
    for (let i = 0; i < len1; i++) {
        lcsString1 += chars[Math.floor(Math.random() * chars.length)];
    }
    
    for (let i = 0; i < len2; i++) {
        lcsString2 += chars[Math.floor(Math.random() * chars.length)];
    }
    
    displayLCSProblem();
}

// 生成LIS问题
function generateLISProblem() {
    lisArray = [];
    for (let i = 0; i < dpProblemSize; i++) {
        lisArray.push(Math.floor(Math.random() * 50) + 1);
    }
    
    displayLISProblem();
}

// 显示斐波那契问题
function displayFibonacciProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">斐波那契数列问题</h4>
        <p class="text-gray-300 mb-4">计算第 ${dpProblemSize} 个斐波那契数</p>
        <div class="flex flex-wrap gap-2">
            ${fibSequence.slice(0, Math.min(dpProblemSize + 1, 11)).map((val, i) => 
                `<div class="array-element ${i <= 1 ? 'computed' : ''}" id="fib-${i}">${i}: ${val}</div>`
            ).join('')}
            ${dpProblemSize > 10 ? '<div class="text-gray-400">...</div>' : ''}
        </div>
        <p class="text-sm text-gray-400 mt-4">递推公式: F(n) = F(n-1) + F(n-2)</p>
    `;
}

// 显示背包问题
function displayKnapsackProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">0-1背包问题</h4>
        <p class="text-gray-300 mb-4">背包容量: ${knapsackCapacity}kg</p>
        <div class="grid grid-cols-1 gap-2 mb-4">
            ${knapsackItems.map(item => 
                `<div class="knapsack-item" id="item-${item.id}">
                    ${item.name}: ${item.weight}kg, ¥${item.value}
                </div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400">目标：在不超过背包容量的情况下，使总价值最大化</p>
    `;
}

// 显示LCS问题
function displayLCSProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">最长公共子序列问题</h4>
        <div class="space-y-3">
            <div>
                <span class="text-gray-300">字符串1: </span>
                <span class="code-font text-cyan-400">${lcsString1}</span>
            </div>
            <div>
                <span class="text-gray-300">字符串2: </span>
                <span class="code-font text-cyan-400">${lcsString2}</span>
            </div>
        </div>
        <p class="text-sm text-gray-400 mt-4">目标：找到两个字符串的最长公共子序列</p>
    `;
}

// 显示LIS问题
function displayLISProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">最长递增子序列问题</h4>
        <div class="flex flex-wrap gap-2 mb-4">
            ${lisArray.map((val, i) => 
                `<div class="array-element" id="lis-${i}">${val}</div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400">目标：找到最长的严格递增子序列</p>
    `;
}

// 开始DP求解
async function startDPSolution() {
    if (isDPRunning) return;
    
    isDPRunning = true;
    dpStartTime = Date.now();
    computationCount = 0;
    
    // 禁用控制按钮
    document.getElementById('startDP').disabled = true;
    document.getElementById('generateProblem').disabled = true;
    
    try {
        switch (currentDPAlgorithm) {
            case 'fibonacci':
                await fibonacciDPVisualization();
                break;
            case 'knapsack':
                await knapsackDPVisualization();
                break;
            case 'lcs':
                await lcsDPVisualization();
                break;
            case 'lis':
                await lisDPVisualization();
                break;
        }
    } catch (error) {
        console.error('DP求解过程中出现错误:', error);
    } finally {
        isDPRunning = false;
        
        // 重新启用控制按钮
        document.getElementById('startDP').disabled = false;
        document.getElementById('generateProblem').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - dpStartTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// 停止DP求解
function stopDPSolution() {
    isDPRunning = false;
    document.getElementById('startDP').disabled = false;
    document.getElementById('generateProblem').disabled = false;
}

// 斐波那契DP可视化
async function fibonacciDPVisualization() {
    addDPStep('初始化DP表格');
    
    // 创建DP表格
    const dp = new Array(dpProblemSize + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    // 显示DP表格
    await displayDPTabel(1, dpProblemSize + 1, dp);
    
    addDPStep('设置基础情况: F(0) = 0, F(1) = 1');
    await highlightDPCell(0, 'computed');
    await highlightDPCell(1, 'computed');
    await sleep(getDPAnimationDelay());
    
    for (let i = 2; i <= dpProblemSize && isDPRunning; i++) {
        computationCount++;
        updateDPStatistics();
        
        addDPStep(`计算 F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i-1] + dp[i-2]}`);
        
        // 高亮依赖项
        await highlightDPCell(i-1, 'dependency');
        await highlightDPCell(i-2, 'dependency');
        await sleep(getDPAnimationDelay());
        
        // 计算当前值
        dp[i] = dp[i-1] + dp[i-2];
        
        // 高亮当前计算
        await highlightDPCell(i, 'current');
        await sleep(getDPAnimationDelay());
        
        // 更新斐波那契序列显示
        const fibElement = document.getElementById(`fib-${i}`);
        if (fibElement) {
            fibElement.textContent = `${i}: ${dp[i]}`;
            fibElement.className = 'array-element computed';
        }
        
        // 标记为已计算
        await highlightDPCell(i, 'computed');
        await resetDPCell(i-1);
        await resetDPCell(i-2);
        
        await sleep(getDPAnimationDelay());
    }
    
    const result = dp[dpProblemSize];
    document.getElementById('finalResult').textContent = result;
    addDPStep(`计算完成！F(${dpProblemSize}) = ${result}`);
}

// 背包问题DP可视化
async function knapsackDPVisualization() {
    const n = knapsackItems.length;
    const W = knapsackCapacity;
    
    addDPStep(`初始化DP表格: dp[${n+1}][${W+1}]`);
    
    // 创建DP表格
    const dp = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
    
    // 显示DP表格
    await displayDPTabel(n + 1, W + 1, dp);
    
    addDPStep('设置基础情况: dp[0][w] = 0 (没有物品时价值为0)');
    
    // 填充第一行
    for (let w = 0; w <= W && isDPRunning; w++) {
        await highlightDPCell(0 * (W + 1) + w, 'computed');
        if (w % 3 === 0) await sleep(getDPAnimationDelay() / 2);
    }
    
    for (let i = 1; i <= n && isDPRunning; i++) {
        const item = knapsackItems[i-1];
        addDPStep(`考虑物品${i}: ${item.name} (重量:${item.weight}, 价值:¥${item.value})`);
        
        // 高亮当前物品
        const itemElement = document.getElementById(`item-${item.id}`);
        if (itemElement) {
            itemElement.className = 'knapsack-item selected';
        }
        
        for (let w = 0; w <= W && isDPRunning; w++) {
            computationCount++;
            updateDPStatistics();
            
            if (item.weight <= w) {
                // 可以放入背包
                const includeValue = item.value + dp[i-1][w - item.weight];
                const excludeValue = dp[i-1][w];
                
                addDPStep(`背包容量${w}: 放入价值${includeValue}, 不放价值${excludeValue}`);
                
                dp[i][w] = Math.max(includeValue, excludeValue);
                
                // 高亮依赖项
                await highlightDPCell((i-1) * (W + 1) + w, 'dependency');
                if (w >= item.weight) {
                    await highlightDPCell((i-1) * (W + 1) + (w - item.weight), 'dependency');
                }
                
                await sleep(getDPAnimationDelay());
                
                // 高亮当前计算
                await highlightDPCell(i * (W + 1) + w, 'current');
                await sleep(getDPAnimationDelay());
                
                // 重置依赖项
                await resetDPCell((i-1) * (W + 1) + w);
                if (w >= item.weight) {
                    await resetDPCell((i-1) * (W + 1) + (w - item.weight));
                }
            } else {
                // 不能放入背包
                dp[i][w] = dp[i-1][w];
                addDPStep(`背包容量${w}: 物品太重，不能放入`);
                
                await highlightDPCell((i-1) * (W + 1) + w, 'dependency');
                await sleep(getDPAnimationDelay());
                await highlightDPCell(i * (W + 1) + w, 'current');
                await sleep(getDPAnimationDelay());
                await resetDPCell((i-1) * (W + 1) + w);
            }
            
            // 标记为已计算
            await highlightDPCell(i * (W + 1) + w, 'computed');
            await sleep(getDPAnimationDelay());
        }
        
        // 重置物品高亮
        if (itemElement) {
            itemElement.className = 'knapsack-item';
        }
    }
    
    const result = dp[n][W];
    document.getElementById('finalResult').textContent = `¥${result}`;
    addDPStep(`计算完成！最大价值: ¥${result}`);
}

// LCS DP可视化
async function lcsDPVisualization() {
    const m = lcsString1.length;
    const n = lcsString2.length;
    
    addDPStep(`初始化DP表格: dp[${m+1}][${n+1}]`);
    
    // 创建DP表格
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // 显示DP表格
    await displayDPTabel(m + 1, n + 1, dp, lcsString1, lcsString2);
    
    addDPStep('设置基础情况: dp[i][0] = dp[0][j] = 0');
    
    for (let i = 1; i <= m && isDPRunning; i++) {
        for (let j = 1; j <= n && isDPRunning; j++) {
            computationCount++;
            updateDPStatistics();
            
            addDPStep(`比较字符: '${lcsString1[i-1]}' vs '${lcsString2[j-1]}'`);
            
            if (lcsString1[i-1] === lcsString2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
                addDPStep(`字符匹配！dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}`);
                
                // 高亮依赖项
                await highlightDPCell((i-1) * (n + 1) + (j-1), 'dependency');
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                addDPStep(`字符不匹配，取最大值: dp[${i}][${j}] = ${dp[i][j]}`);
                
                // 高亮依赖项
                await highlightDPCell((i-1) * (n + 1) + j, 'dependency');
                await highlightDPCell(i * (n + 1) + (j-1), 'dependency');
            }
            
            await sleep(getDPAnimationDelay());
            
            // 高亮当前计算
            await highlightDPCell(i * (n + 1) + j, 'current');
            await sleep(getDPAnimationDelay());
            
            // 重置依赖项
            if (lcsString1[i-1] === lcsString2[j-1]) {
                await resetDPCell((i-1) * (n + 1) + (j-1));
            } else {
                await resetDPCell((i-1) * (n + 1) + j);
                await resetDPCell(i * (n + 1) + (j-1));
            }
            
            // 标记为已计算
            await highlightDPCell(i * (n + 1) + j, 'computed');
            await sleep(getDPAnimationDelay());
        }
    }
    
    const result = dp[m][n];
    document.getElementById('finalResult').textContent = result;
    addDPStep(`计算完成！最长公共子序列长度: ${result}`);
}

// LIS DP可视化
async function lisDPVisualization() {
    const n = lisArray.length;
    
    addDPStep(`初始化DP数组: dp[${n}]，每个位置初始值为1`);
    
    // 创建DP数组
    const dp = new Array(n).fill(1);
    
    // 显示DP数组
    await displayDPArray(dp);
    
    addDPStep('基础情况: 每个元素本身就是一个长度为1的递增子序列');
    
    for (let i = 0; i < n && isDPRunning; i++) {
        addDPStep(`考虑位置 ${i} 的元素: ${lisArray[i]}`);
        
        // 高亮当前元素
        const currentElement = document.getElementById(`lis-${i}`);
        if (currentElement) {
            currentElement.className = 'array-element current';
        }
        
        for (let j = 0; j < i && isDPRunning; j++) {
            computationCount++;
            updateDPStatistics();
            
            // 高亮比较的元素
            const compareElement = document.getElementById(`lis-${j}`);
            if (compareElement) {
                compareElement.className = 'array-element dependency';
            }
            
            if (lisArray[j] < lisArray[i]) {
                addDPStep(`${lisArray[j]} < ${lisArray[i]}，可以扩展子序列`);
                dp[i] = Math.max(dp[i], dp[j] + 1);
                
                // 更新DP数组显示
                const dpCell = document.getElementById(`dp-${i}`);
                if (dpCell) {
                    dpCell.textContent = dp[i];
                    dpCell.className = 'array-element current';
                }
            }
            
            await sleep(getDPAnimationDelay());
            
            if (compareElement) {
                compareElement.className = 'array-element';
            }
        }
        
        // 标记当前元素为已处理
        if (currentElement) {
            currentElement.className = 'array-element computed';
        }
        
        await sleep(getDPAnimationDelay());
    }
    
    const result = Math.max(...dp);
    document.getElementById('finalResult').textContent = result;
    addDPStep(`计算完成！最长递增子序列长度: ${result}`);
}

// 显示DP表格
async function displayDPTabel(rows, cols, data, str1 = null, str2 = null) {
    const container = document.getElementById('dpTableContainer');
    container.innerHTML = '';
    
    const table = document.createElement('div');
    table.className = 'dp-table';
    table.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'dp-cell';
            cell.id = `dp-${i * cols + j}`;
            
            let value = '';
            if (Array.isArray(data[i])) {
                value = data[i][j] !== undefined ? data[i][j] : '';
            } else {
                value = data[i * cols + j] !== undefined ? data[i * cols + j] : '';
            }
            
            cell.textContent = value;
            
            // 添加行列标签
            if (str1 && str2) {
                if (i === 0 && j > 0) {
                    cell.textContent = str2[j-1] || '';
                    cell.style.fontSize = '12px';
                    cell.style.color = '#9ca3af';
                } else if (j === 0 && i > 0) {
                    cell.textContent = str1[i-1] || '';
                    cell.style.fontSize = '12px';
                    cell.style.color = '#9ca3af';
                } else if (i === 0 && j === 0) {
                    cell.textContent = '';
                } else {
                    cell.textContent = value;
                }
            }
            
            table.appendChild(cell);
        }
    }
    
    container.appendChild(table);
}

// 显示DP数组
async function displayDPArray(dp) {
    const container = document.getElementById('dpTableContainer');
    container.innerHTML = '';
    
    const arrayContainer = document.createElement('div');
    arrayContainer.className = 'flex flex-wrap gap-2';
    
    dp.forEach((value, i) => {
        const cell = document.createElement('div');
        cell.className = 'array-element';
        cell.id = `dp-${i}`;
        cell.textContent = value;
        cell.style.minWidth = '60px';
        arrayContainer.appendChild(cell);
    });
    
    container.appendChild(arrayContainer);
}

// 高亮DP单元格
async function highlightDPCell(index, type) {
    const cell = document.getElementById(`dp-${index}`);
    if (cell) {
        cell.className = `dp-cell ${type}`;
    }
}

// 重置DP单元格
async function resetDPCell(index) {
    const cell = document.getElementById(`dp-${index}`);
    if (cell) {
        cell.className = 'dp-cell';
    }
}

// 更新DP信息
function updateDPInfo() {
    const algorithmInfo = {
        fibonacci: {
            complexity: 'O(n)',
            spaceComplexity: 'O(n)',
            type: '线性DP'
        },
        knapsack: {
            complexity: 'O(n×W)',
            spaceComplexity: 'O(n×W)',
            type: '二维DP'
        },
        lcs: {
            complexity: 'O(m×n)',
            spaceComplexity: 'O(m×n)',
            type: '二维DP'
        },
        lis: {
            complexity: 'O(n²)',
            spaceComplexity: 'O(n)',
            type: '线性DP'
        }
    };
    
    const info = algorithmInfo[currentDPAlgorithm];
    if (info) {
        document.getElementById('currentComplexity').textContent = info.complexity;
        document.getElementById('spaceComplexity').textContent = info.spaceComplexity;
        document.getElementById('problemType').textContent = info.type;
    }
}

// 添加DP步骤
function addDPStep(step) {
    const stepsContainer = document.getElementById('dpSteps');
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

// 清除DP步骤
function clearDPSteps() {
    const stepsContainer = document.getElementById('dpSteps');
    stepsContainer.innerHTML = '<div class="text-gray-400">点击"开始求解"查看详细的DP求解步骤...</div>';
}

// 更新DP统计信息
function updateDPStatistics() {
    document.getElementById('computationCount').textContent = computationCount;
    document.getElementById('currentProblemSize').textContent = dpProblemSize;
}

// 重置DP统计信息
function resetDPStatistics() {
    document.getElementById('computationCount').textContent = '0';
    document.getElementById('finalResult').textContent = '-';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('currentProblemSize').textContent = dpProblemSize;
    document.getElementById('solutionStatus').textContent = '就绪';
}

// 获取DP动画延迟
function getDPAnimationDelay() {
    return Math.max(200, 1500 - dpAnimationSpeed * 100);
}

// 工具函数：睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出函数供其他文件使用
window.DPAlgorithms = {
    initializeDPPage,
    startDPSolution,
    stopDPSolution
};