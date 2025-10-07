// 贪心算法实现和可视化控制
// 包含活动选择、硬币找零、哈夫曼编码等贪心算法的可视化

// 全局变量
let greedyProblemSize = 8;
let greedyAnimationSpeed = 5;
let isGreedyRunning = false;
let selectionCount = 0;
let greedyStartTime = 0;
let currentGreedyAlgorithm = 'activity-selection';
let targetAmount = 47;

// 问题特定数据
let activities = [];
let coins = [25, 10, 5, 1]; // 美元硬币系统
let huffmanFrequencies = {};

// 初始化贪心页面
function initializeGreedyPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateGreedyAlgorithm);
    document.getElementById('problemSize').addEventListener('input', updateGreedyProblemSize);
    document.getElementById('targetAmount').addEventListener('input', updateTargetAmount);
    document.getElementById('speed').addEventListener('input', updateGreedySpeed);
    document.getElementById('generateProblem').addEventListener('click', generateGreedyProblem);
    document.getElementById('startAlgorithm').addEventListener('click', startGreedyAlgorithm);
    document.getElementById('stopAlgorithm').addEventListener('click', stopGreedyAlgorithm);
    
    // 初始化问题
    generateGreedyProblem();
    updateGreedyAlgorithm();
}

// 更新贪心算法
function updateGreedyAlgorithm() {
    currentGreedyAlgorithm = document.getElementById('algorithmSelect').value;
    
    // 显示/隐藏特定参数
    const additionalParams = document.getElementById('additionalParams');
    if (currentGreedyAlgorithm === 'coin-change') {
        additionalParams.style.display = 'block';
    } else {
        additionalParams.style.display = 'none';
    }
    
    generateGreedyProblem();
    updateGreedyInfo();
}

// 更新问题规模
function updateGreedyProblemSize() {
    const sizeSlider = document.getElementById('problemSize');
    const sizeValue = document.getElementById('problemSizeValue');
    
    greedyProblemSize = parseInt(sizeSlider.value);
    sizeValue.textContent = greedyProblemSize;
    
    generateGreedyProblem();
}

// 更新目标金额
function updateTargetAmount() {
    const amountSlider = document.getElementById('targetAmount');
    const amountValue = document.getElementById('targetAmountValue');
    
    targetAmount = parseInt(amountSlider.value);
    amountValue.textContent = targetAmount;
    
    if (currentGreedyAlgorithm === 'coin-change') {
        generateGreedyProblem();
    }
}

// 更新贪心速度
function updateGreedySpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    greedyAnimationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = greedyAnimationSpeed;
}

// 生成贪心问题
function generateGreedyProblem() {
    if (isGreedyRunning) return;
    
    switch (currentGreedyAlgorithm) {
        case 'activity-selection':
            generateActivitySelectionProblem();
            break;
        case 'coin-change':
            generateCoinChangeProblem();
            break;
        case 'huffman':
            generateHuffmanProblem();
            break;
        case 'job-scheduling':
            generateJobSchedulingProblem();
            break;
    }
    
    resetGreedyStatistics();
    clearGreedySteps();
}

// 生成活动选择问题
function generateActivitySelectionProblem() {
    activities = [];
    const startTimes = [1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12];
    const endTimes = [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16];
    
    for (let i = 0; i < Math.min(greedyProblemSize, startTimes.length); i++) {
        activities.push({
            id: i,
            name: `活动${i + 1}`,
            start: startTimes[i] + Math.floor(Math.random() * 3),
            end: endTimes[i] + Math.floor(Math.random() * 3),
            selected: false
        });
    }
    
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    displayActivitySelectionProblem();
}

// 生成硬币找零问题
function generateCoinChangeProblem() {
    displayCoinChangeProblem();
}

// 生成哈夫曼编码问题
function generateHuffmanProblem() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    huffmanFrequencies = {};
    
    for (let i = 0; i < Math.min(greedyProblemSize, 8); i++) {
        const char = chars[i];
        huffmanFrequencies[char] = Math.floor(Math.random() * 50) + 1;
    }
    
    displayHuffmanProblem();
}

// 生成任务调度问题
function generateJobSchedulingProblem() {
    const jobNames = ['任务A', '任务B', '任务C', '任务D', '任务E', '任务F', '任务G', '任务H'];
    activities = [];
    
    for (let i = 0; i < Math.min(greedyProblemSize, jobNames.length); i++) {
        activities.push({
            id: i,
            name: jobNames[i],
            deadline: Math.floor(Math.random() * 10) + 1,
            profit: Math.floor(Math.random() * 100) + 10,
            selected: false
        });
    }
    
    // 按利润降序排序
    activities.sort((a, b) => b.profit - a.profit);
    
    displayJobSchedulingProblem();
}

// 显示活动选择问题
function displayActivitySelectionProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">活动选择问题</h4>
        <p class="text-gray-300 mb-4">选择尽可能多的互不冲突的活动</p>
        <div class="space-y-2">
            ${activities.map((activity, i) => 
                `<div class="activity-item" id="activity-${i}" data-start="${activity.start}" data-end="${activity.end}">
                    <div>
                        <span class="font-bold">${activity.name}</span>
                        <span class="text-sm text-gray-400 ml-2">时间: ${activity.start}:00 - ${activity.end}:00</span>
                    </div>
                    <div class="text-sm text-gray-400">
                        持续: ${activity.end - activity.start}小时
                    </div>
                </div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400 mt-4">贪心策略：每次选择结束时间最早的活动</p>
    `;
}

// 显示硬币找零问题
function displayCoinChangeProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">硬币找零问题</h4>
        <p class="text-gray-300 mb-4">用最少数量的硬币凑出 ¥${targetAmount}</p>
        <div class="mb-4">
            <span class="text-gray-300">可用硬币: </span>
            <div class="inline-flex gap-2 mt-2">
                ${coins.map(coin => 
                    `<span class="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">¥${coin}</span>`
                ).join('')}
            </div>
        </div>
        <div class="mb-4">
            <span class="text-gray-300">目标金额: </span>
            <span class="text-2xl font-bold text-orange-400">¥${targetAmount}</span>
        </div>
        <div id="coinSelection" class="flex flex-wrap gap-2 min-h-16">
            <!-- 选择的硬币将显示在这里 -->
        </div>
        <p class="text-sm text-gray-400 mt-4">贪心策略：每次选择面值最大的硬币</p>
    `;
}

// 显示哈夫曼编码问题
function displayHuffmanProblem() {
    const container = document.getElementById('problemVisualization');
    const maxFreq = Math.max(...Object.values(huffmanFrequencies));
    
    container.innerHTML = `
        <h4 class="font-semibold mb-3">哈夫曼编码</h4>
        <p class="text-gray-300 mb-4">根据字符频率构建最优前缀码</p>
        <div class="space-y-3">
            ${Object.entries(huffmanFrequencies).map(([char, freq]) => 
                `<div class="flex items-center justify-between">
                    <span class="font-bold text-lg">${char}</span>
                    <div class="flex-1 mx-4">
                        <div class="frequency-bar" style="width: ${(freq / maxFreq) * 200}px;">
                            <div class="frequency-label">${freq}</div>
                        </div>
                    </div>
                    <span class="text-sm text-gray-400">频率: ${freq}</span>
                </div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400 mt-4">贪心策略：每次合并频率最小的两个节点</p>
    `;
}

// 显示任务调度问题
function displayJobSchedulingProblem() {
    const container = document.getElementById('problemVisualization');
    container.innerHTML = `
        <h4 class="font-semibold mb-3">任务调度问题</h4>
        <p class="text-gray-300 mb-4">在截止时间前完成最大利润的任务</p>
        <div class="space-y-2">
            ${activities.map((job, i) => 
                `<div class="activity-item" id="job-${i}" data-deadline="${job.deadline}" data-profit="${job.profit}">
                    <div>
                        <span class="font-bold">${job.name}</span>
                        <span class="text-sm text-gray-400 ml-2">截止: ${job.deadline}天</span>
                    </div>
                    <div class="text-green-400 font-bold">
                        ¥${job.profit}
                    </div>
                </div>`
            ).join('')}
        </div>
        <p class="text-sm text-gray-400 mt-4">贪心策略：每次选择利润最高的任务</p>
    `;
}

// 开始贪心算法
async function startGreedyAlgorithm() {
    if (isGreedyRunning) return;
    
    isGreedyRunning = true;
    greedyStartTime = Date.now();
    selectionCount = 0;
    
    // 禁用控制按钮
    document.getElementById('startAlgorithm').disabled = true;
    document.getElementById('generateProblem').disabled = true;
    
    // 清除之前的结果
    clearGreedySteps();
    resetGreedyDisplay();
    
    try {
        let result = null;
        
        switch (currentGreedyAlgorithm) {
            case 'activity-selection':
                result = await activitySelectionVisualization();
                break;
            case 'coin-change':
                result = await coinChangeVisualization();
                break;
            case 'huffman':
                result = await huffmanVisualization();
                break;
            case 'job-scheduling':
                result = await jobSchedulingVisualization();
                break;
        }
        
        // 显示结果
        if (result !== null) {
            document.getElementById('finalResult').textContent = result;
        }
        
    } catch (error) {
        console.error('贪心算法执行过程中出现错误:', error);
    } finally {
        isGreedyRunning = false;
        
        // 重新启用控制按钮
        document.getElementById('startAlgorithm').disabled = false;
        document.getElementById('generateProblem').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - greedyStartTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// 停止贪心算法
function stopGreedyAlgorithm() {
    isGreedyRunning = false;
    document.getElementById('startAlgorithm').disabled = false;
    document.getElementById('generateProblem').disabled = false;
}

// 活动选择算法可视化
async function activitySelectionVisualization() {
    addGreedyStep('按结束时间对活动进行排序...');
    addGreedyStep('选择结束时间最早的活动作为第一个活动');
    
    let lastEndTime = -1;
    const selectedActivities = [];
    
    for (let i = 0; i < activities.length && isGreedyRunning; i++) {
        const activity = activities[i];
        const activityElement = document.getElementById(`activity-${i}`);
        
        addGreedyStep(`考虑活动 ${activity.name} (时间: ${activity.start}-${activity.end})`);
        
        // 高亮当前活动
        if (activityElement) {
            activityElement.className = 'activity-item current';
        }
        
        await sleep(getGreedyAnimationDelay());
        
        if (activity.start >= lastEndTime) {
            // 可以选择这个活动
            selectionCount++;
            updateGreedyStatistics();
            
            selectedActivities.push(activity);
            lastEndTime = activity.end;
            
            addGreedyStep(`选择活动 ${activity.name}！结束时间更新为 ${lastEndTime}`);
            
            if (activityElement) {
                activityElement.className = 'activity-item selected';
            }
        } else {
            // 与已选活动冲突
            addGreedyStep(`活动 ${activity.name} 与已选活动冲突，跳过`);
            
            if (activityElement) {
                activityElement.className = 'activity-item conflict';
            }
        }
        
        await sleep(getGreedyAnimationDelay());
        
        // 重置样式（除了已选择的）
        if (activityElement && !selectedActivities.includes(activity)) {
            activityElement.className = 'activity-item';
        }
    }
    
    addGreedyStep(`算法完成！共选择了 ${selectedActivities.length} 个活动`);
    return `选择了 ${selectedActivities.length} 个活动`;
}

// 硬币找零算法可视化
async function coinChangeVisualization() {
    addGreedyStep(`目标金额: ¥${targetAmount}`);
    addGreedyStep('贪心策略：每次选择面值最大的硬币');
    
    let remaining = targetAmount;
    const selectedCoins = [];
    const coinCounts = {};
    
    // 初始化硬币计数
    coins.forEach(coin => {
        coinCounts[coin] = 0;
    });
    
    for (let i = 0; i < coins.length && isGreedyRunning && remaining > 0; i++) {
        const coin = coins[i];
        
        addGreedyStep(`考虑 ¥${coin} 硬币`);
        
        if (coin <= remaining) {
            const count = Math.floor(remaining / coin);
            remaining = remaining % coin;
            
            coinCounts[coin] = count;
            selectionCount += count;
            
            addGreedyStep(`使用 ${count} 个 ¥${coin} 硬币，剩余 ¥${remaining}`);
            
            // 显示选择的硬币
            await displaySelectedCoins(coin, count);
        } else {
            addGreedyStep(`¥${coin} 硬币太大，跳过`);
        }
        
        updateGreedyStatistics();
        await sleep(getGreedyAnimationDelay());
    }
    
    if (remaining === 0) {
        addGreedyStep('成功凑出目标金额！');
        return `使用 ${selectionCount} 个硬币`;
    } else {
        addGreedyStep('无法凑出目标金额！');
        return '无法凑出';
    }
}

// 显示选择的硬币
async function displaySelectedCoins(coin, count) {
    const container = document.getElementById('coinSelection');
    
    for (let i = 0; i < count && isGreedyRunning; i++) {
        const coinElement = document.createElement('div');
        coinElement.className = 'coin-item selected';
        coinElement.textContent = `¥${coin}`;
        container.appendChild(coinElement);
        
        await sleep(getGreedyAnimationDelay() / 2);
    }
}

// 哈夫曼编码算法可视化
async function huffmanVisualization() {
    addGreedyStep('构建哈夫曼树...');
    addGreedyStep('初始节点：每个字符作为一个叶子节点');
    
    // 创建初始节点
    let nodes = Object.entries(huffmanFrequencies).map(([char, freq]) => ({
        char,
        freq,
        left: null,
        right: null,
        isLeaf: true
    }));
    
    // 按频率排序
    nodes.sort((a, b) => a.freq - b.freq);
    
    addGreedyStep(`初始节点数: ${nodes.length}`);
    
    while (nodes.length > 1 && isGreedyRunning) {
        // 选择频率最小的两个节点
        const left = nodes.shift();
        const right = nodes.shift();
        
        addGreedyStep(`选择频率最小的两个节点: ${left.char || '内部节点'} (${left.freq}) 和 ${right.char || '内部节点'} (${right.freq})`);
        
        // 创建新节点
        const newNode = {
            char: null,
            freq: left.freq + right.freq,
            left,
            right,
            isLeaf: false
        };
        
        addGreedyStep(`合并为新节点，频率: ${newNode.freq}`);
        
        // 将新节点插入到正确位置
        let insertIndex = 0;
        while (insertIndex < nodes.length && nodes[insertIndex].freq < newNode.freq) {
            insertIndex++;
        }
        nodes.splice(insertIndex, 0, newNode);
        
        selectionCount++;
        updateGreedyStatistics();
        
        await sleep(getGreedyAnimationDelay());
    }
    
    if (nodes.length === 1) {
        const root = nodes[0];
        addGreedyStep('哈夫曼树构建完成！');
        
        // 生成哈夫曼编码
        const codes = {};
        generateHuffmanCodes(root, '', codes);
        
        addGreedyStep('生成哈夫曼编码:');
        Object.entries(codes).forEach(([char, code]) => {
            addGreedyStep(`${char}: ${code}`);
        });
        
        return '哈夫曼编码生成完成';
    }
    
    return '构建失败';
}

// 生成哈夫曼编码
function generateHuffmanCodes(node, code, codes) {
    if (node.isLeaf) {
        codes[node.char] = code;
        return;
    }
    
    if (node.left) {
        generateHuffmanCodes(node.left, code + '0', codes);
    }
    
    if (node.right) {
        generateHuffmanCodes(node.right, code + '1', codes);
    }
}

// 任务调度算法可视化
async function jobSchedulingVisualization() {
    addGreedyStep('按利润对任务进行降序排序...');
    addGreedyStep('依次安排每个任务到最晚的空闲时间槽');
    
    const maxDeadline = Math.max(...activities.map(job => job.deadline));
    const timeSlots = new Array(maxDeadline + 1).fill(null);
    const selectedJobs = [];
    
    addGreedyStep(`最大截止时间: ${maxDeadline}天`);
    
    for (let i = 0; i < activities.length && isGreedyRunning; i++) {
        const job = activities[i];
        const jobElement = document.getElementById(`job-${i}`);
        
        addGreedyStep(`考虑任务 ${job.name} (截止: ${job.deadline}天, 利润: ¥${job.profit})`);
        
        // 高亮当前任务
        if (jobElement) {
            jobElement.className = 'activity-item current';
        }
        
        await sleep(getGreedyAnimationDelay());
        
        // 从截止时间开始向前寻找空闲时间槽
        let slotFound = false;
        for (let t = Math.min(job.deadline, maxDeadline); t >= 1; t--) {
            if (timeSlots[t] === null) {
                timeSlots[t] = job;
                selectedJobs.push(job);
                slotFound = true;
                
                addGreedyStep(`将任务 ${job.name} 安排到第 ${t} 天`);
                
                if (jobElement) {
                    jobElement.className = 'activity-item selected';
                }
                
                selectionCount++;
                updateGreedyStatistics();
                break;
            }
        }
        
        if (!slotFound) {
            addGreedyStep(`任务 ${job.name} 无法在截止时间内完成，跳过`);
            
            if (jobElement) {
                jobElement.className = 'activity-item conflict';
            }
        }
        
        await sleep(getGreedyAnimationDelay());
        
        // 重置样式（除了已选择的）
        if (jobElement && !selectedJobs.includes(job)) {
            jobElement.className = 'activity-item';
        }
    }
    
    const totalProfit = selectedJobs.reduce((sum, job) => sum + job.profit, 0);
    addGreedyStep(`算法完成！总利润: ¥${totalProfit}，安排了 ${selectedJobs.length} 个任务`);
    
    return `总利润: ¥${totalProfit}`;
}

// 更新贪心算法信息
function updateGreedyInfo() {
    const algorithmInfo = {
        'activity-selection': {
            complexity: 'O(n log n)',
            spaceComplexity: 'O(1)',
            type: '区间贪心'
        },
        'coin-change': {
            complexity: 'O(n)',
            spaceComplexity: 'O(1)',
            type: '选择贪心'
        },
        'huffman': {
            complexity: 'O(n log n)',
            spaceComplexity: 'O(n)',
            type: '树贪心'
        },
        'job-scheduling': {
            complexity: 'O(n²)',
            spaceComplexity: 'O(n)',
            type: '调度贪心'
        }
    };
    
    const info = algorithmInfo[currentGreedyAlgorithm];
    if (info) {
        document.getElementById('currentComplexity').textContent = info.complexity;
        document.getElementById('spaceComplexity').textContent = info.spaceComplexity;
        document.getElementById('algorithmType').textContent = info.type;
    }
    
    // 更新代码显示
    updateGreedyAlgorithmCode();
}

// 更新贪心算法代码
function updateGreedyAlgorithmCode() {
    const codeElement = document.getElementById('algorithmCode');
    
    const codes = {
        'activity-selection': `function activitySelection(activities) {
    // 按结束时间排序
    activities.sort((a, b) => a.end - b.end);
    
    const selected = [];
    let lastEnd = -1;
    
    for (const activity of activities) {
        if (activity.start >= lastEnd) {
            selected.push(activity);
            lastEnd = activity.end;
        }
    }
    
    return selected;
}`,
        'coin-change': `function coinChange(coins, amount) {
    const result = [];
    
    for (const coin of coins.sort((a, b) => b - a)) {
        while (amount >= coin) {
            result.push(coin);
            amount -= coin;
        }
    }
    
    return amount === 0 ? result : null;
}`,
        'huffman': `function huffmanCoding(frequencies) {
    const nodes = Object.entries(frequencies)
        .map(([char, freq]) => ({ char, freq, left: null, right: null }));
    
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        
        const left = nodes.shift();
        const right = nodes.shift();
        
        const newNode = {
            freq: left.freq + right.freq,
            left,
            right
        };
        
        nodes.push(newNode);
    }
    
    return nodes[0];
}`,
        'job-scheduling': `function jobScheduling(jobs) {
    // 按利润降序排序
    jobs.sort((a, b) => b.profit - a.profit);
    
    const maxDeadline = Math.max(...jobs.map(job => job.deadline));
    const slots = new Array(maxDeadline + 1).fill(null);
    const selected = [];
    
    for (const job of jobs) {
        for (let t = job.deadline; t >= 1; t--) {
            if (!slots[t]) {
                slots[t] = job;
                selected.push(job);
                break;
            }
        }
    }
    
    return selected;
}`
    };
    
    codeElement.textContent = codes[currentGreedyAlgorithm] || '// 选择算法查看代码实现';
}

// 添加贪心步骤
function addGreedyStep(step) {
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

// 清除贪心步骤
function clearGreedySteps() {
    const stepsContainer = document.getElementById('algorithmSteps');
    stepsContainer.innerHTML = '<div class="text-gray-400">点击"开始求解"查看详细的贪心选择步骤...</div>';
}

// 更新贪心统计信息
function updateGreedyStatistics() {
    document.getElementById('selectionCount').textContent = selectionCount;
    document.getElementById('currentProblemSize').textContent = greedyProblemSize;
}

// 重置贪心统计信息
function resetGreedyStatistics() {
    document.getElementById('selectionCount').textContent = '0';
    document.getElementById('finalResult').textContent = '-';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('currentProblemSize').textContent = greedyProblemSize;
    document.getElementById('solutionStatus').textContent = '就绪';
}

// 重置贪心显示
function resetGreedyDisplay() {
    // 重置所有活动项的样式
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.className = 'activity-item';
    });
    
    // 重置硬币选择区域
    const coinSelection = document.getElementById('coinSelection');
    if (coinSelection) {
        coinSelection.innerHTML = '';
    }
}

// 获取贪心动画延迟
function getGreedyAnimationDelay() {
    return Math.max(200, 1500 - greedyAnimationSpeed * 100);
}

// 工具函数：睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出函数供其他文件使用
window.GreedyAlgorithms = {
    initializeGreedyPage,
    startGreedyAlgorithm,
    stopGreedyAlgorithm
};