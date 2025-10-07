// 搜索算法实现和可视化控制
// 包含线性搜索、二分搜索等算法的具体实现和动画控制

// 全局变量
let searchArray = [];
let isSearching = false;
let searchAnimationSpeed = 5;
let searchArraySize = 20;
let searchComparisons = 0;
let searchStartTime = 0;

// 初始化搜索页面
function initializeSearchPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateSearchAlgorithmInfo);
    document.getElementById('arraySize').addEventListener('input', updateSearchArraySize);
    document.getElementById('speed').addEventListener('input', updateSearchSpeed);
    document.getElementById('generateArray').addEventListener('click', generateNewSearchArray);
    document.getElementById('startSearch').addEventListener('click', startSearch);
    document.getElementById('stopSearch').addEventListener('click', stopSearch);
    
    // 初始化数组
    generateNewSearchArray();
    updateSearchAlgorithmInfo();
}

// 生成新的搜索数组
function generateNewSearchArray() {
    if (isSearching) return;
    
    searchArray = [];
    const algorithm = document.getElementById('algorithmSelect').value;
    
    if (algorithm === 'binary') {
        // 二分搜索需要有序数组
        const maxValue = 100;
        const step = Math.floor(maxValue / searchArraySize);
        for (let i = 0; i < searchArraySize; i++) {
            searchArray.push(i * step + Math.floor(Math.random() * step * 0.5));
        }
        searchArray.sort((a, b) => a - b);
    } else {
        // 线性搜索可以是任意数组
        const maxValue = 100;
        for (let i = 0; i < searchArraySize; i++) {
            searchArray.push(Math.floor(Math.random() * maxValue));
        }
    }
    
    displaySearchArray();
    resetSearchStatistics();
    clearSearchSteps();
}

// 显示搜索数组
function displaySearchArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = '';
    
    const elementWidth = Math.max(60, (container.clientWidth - 40) / searchArraySize - 10);
    const elementHeight = 60;
    
    searchArray.forEach((value, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.style.width = `${elementWidth}px`;
        element.style.height = `${elementHeight}px`;
        element.style.background = `linear-gradient(135deg, #374151, #4b5563)`;
        element.style.color = 'white';
        element.style.margin = '5px';
        element.style.fontSize = '14px';
        element.id = `search-element-${index}`;
        element.textContent = value;
        
        // 添加索引标签
        const indexLabel = document.createElement('div');
        indexLabel.textContent = index;
        indexLabel.style.position = 'absolute';
        indexLabel.style.top = '-25px';
        indexLabel.style.left = '50%';
        indexLabel.style.transform = 'translateX(-50%)';
        indexLabel.style.fontSize = '12px';
        indexLabel.style.color = '#9ca3af';
        
        element.style.position = 'relative';
        element.appendChild(indexLabel);
        
        container.appendChild(element);
    });
    
    // 使用flex布局使元素居中排列
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
}

// 更新搜索数组大小
function updateSearchArraySize() {
    const sizeSlider = document.getElementById('arraySize');
    const sizeValue = document.getElementById('arraySizeValue');
    
    searchArraySize = parseInt(sizeSlider.value);
    sizeValue.textContent = searchArraySize;
    
    generateNewSearchArray();
}

// 更新搜索速度
function updateSearchSpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    searchAnimationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = searchAnimationSpeed;
}

// 更新搜索算法信息
function updateSearchAlgorithmInfo() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const bestCase = document.getElementById('bestCase');
    const averageCase = document.getElementById('averageCase');
    const worstCase = document.getElementById('worstCase');
    const arrayType = document.getElementById('arrayType');
    const requirements = document.getElementById('requirements');
    const code = document.getElementById('algorithmCode');
    
    if (algorithm === 'linear') {
        bestCase.textContent = 'O(1)';
        averageCase.textContent = 'O(n)';
        worstCase.textContent = 'O(n)';
        arrayType.textContent = '任意数组';
        requirements.textContent = '无需特殊条件，适用于任何数组。从头到尾逐个检查每个元素，直到找到目标或搜索完整个数组。';
        code.textContent = `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // 找到目标，返回索引
        }
    }
    return -1; // 未找到目标
}`;
    } else if (algorithm === 'binary') {
        bestCase.textContent = 'O(1)';
        averageCase.textContent = 'O(logn)';
        worstCase.textContent = 'O(logn)';
        arrayType.textContent = '有序数组';
        requirements.textContent = '数组必须是有序的（升序或降序）。通过比较中间元素，每次将搜索范围减半，效率很高。';
        code.textContent = `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // 找到目标
        } else if (arr[mid] < target) {
            left = mid + 1; // 搜索右半部分
        } else {
            right = mid - 1; // 搜索左半部分
        }
    }
    
    return -1; // 未找到目标
}`;
    }
    
    // 重新生成数组以适应算法要求
    generateNewSearchArray();
}

// 开始搜索
async function startSearch() {
    if (isSearching) return;
    
    const targetInput = document.getElementById('targetValue');
    const target = parseInt(targetInput.value);
    
    if (isNaN(target)) {
        alert('请输入有效的目标值！');
        return;
    }
    
    isSearching = true;
    searchComparisons = 0;
    searchStartTime = Date.now();
    
    // 禁用控制按钮
    document.getElementById('startSearch').disabled = true;
    document.getElementById('generateArray').disabled = true;
    
    // 清除之前的搜索结果
    clearSearchSteps();
    resetSearchStatistics();
    
    const algorithm = document.getElementById('algorithmSelect').value;
    let result = -1;
    
    try {
        if (algorithm === 'linear') {
            result = await linearSearchVisualization(searchArray, target);
        } else if (algorithm === 'binary') {
            result = await binarySearchVisualization(searchArray, target);
        }
        
        // 更新搜索状态
        updateSearchStatus(result !== -1, result);
        
    } catch (error) {
        console.error('搜索过程中出现错误:', error);
    } finally {
        isSearching = false;
        
        // 重新启用控制按钮
        document.getElementById('startSearch').disabled = false;
        document.getElementById('generateArray').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - searchStartTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// 停止搜索
function stopSearch() {
    isSearching = false;
    document.getElementById('startSearch').disabled = false;
    document.getElementById('generateArray').disabled = false;
}

// 线性搜索可视化
async function linearSearchVisualization(array, target) {
    addSearchStep('开始线性搜索，从数组的第一个元素开始检查...');
    
    for (let i = 0; i < array.length && isSearching; i++) {
        searchComparisons++;
        if (typeof updateSearchStatistics === 'function') {
            updateSearchStatistics();
        }
        
        addSearchStep(`检查索引 ${i} 的元素：${array[i]}`);
        
        // 高亮当前检查的元素
        highlightSearchElement(i, 'searching');
        
        await sleep(getSearchAnimationDelay());
        
        if (array[i] === target) {
            addSearchStep(`找到目标！索引 ${i} 的元素 ${array[i]} 等于目标值 ${target}`);
            highlightSearchElement(i, 'found');
            return i;
        } else {
            addSearchStep(`索引 ${i} 的元素 ${array[i]} 不等于目标值 ${target}，继续搜索...`);
            // 重置颜色
            resetSearchElementColor(i);
        }
        
        await sleep(getSearchAnimationDelay());
    }
    
    addSearchStep(`搜索完成，未找到目标值 ${target}`);
    return -1;
}

// 二分搜索可视化
async function binarySearchVisualization(array, target) {
    let left = 0;
    let right = array.length - 1;
    
    addSearchStep(`开始二分搜索，搜索范围：[${left}, ${right}]`);
    
    while (left <= right && isSearching) {
        const mid = Math.floor((left + right) / 2);
        searchComparisons++;
        if (typeof updateSearchStatistics === 'function') {
            updateSearchStatistics();
        }
        
        addSearchStep(`当前搜索范围：[${left}, ${right}]，检查中间索引 ${mid}`);
        
        // 高亮搜索范围
        highlightSearchRange(left, right);
        // 高亮中间元素
        highlightSearchElement(mid, 'searching');
        
        await sleep(getSearchAnimationDelay());
        
        if (array[mid] === target) {
            addSearchStep(`找到目标！索引 ${mid} 的元素 ${array[mid]} 等于目标值 ${target}`);
            highlightSearchElement(mid, 'found');
            return mid;
        } else if (array[mid] < target) {
            addSearchStep(`中间元素 ${array[mid]} < 目标值 ${target}，搜索右半部分 [${mid + 1}, ${right}]`);
            left = mid + 1;
        } else {
            addSearchStep(`中间元素 ${array[mid]} > 目标值 ${target}，搜索左半部分 [${left}, ${mid - 1}]`);
            right = mid - 1;
        }
        
        // 重置之前的高亮
        resetAllSearchElements();
        
        await sleep(getSearchAnimationDelay());
    }
    
    addSearchStep(`搜索完成，未找到目标值 ${target}`);
    return -1;
}

// 高亮搜索元素
function highlightSearchElement(index, type) {
    const element = document.getElementById(`search-element-${index}`);
    if (element) {
        element.className = `array-element ${type}`;
    }
}

// 高亮搜索范围
function highlightSearchRange(left, right) {
    for (let i = left; i <= right; i++) {
        const element = document.getElementById(`search-element-${i}`);
        if (element) {
            element.classList.add('search-range');
        }
    }
}

// 重置搜索元素颜色
function resetSearchElementColor(index) {
    const element = document.getElementById(`search-element-${index}`);
    if (element) {
        element.className = 'array-element';
    }
}

// 重置所有搜索元素
function resetAllSearchElements() {
    for (let i = 0; i < searchArraySize; i++) {
        const element = document.getElementById(`search-element-${i}`);
        if (element) {
            element.className = 'array-element';
        }
    }
}

// 更新搜索状态
function updateSearchStatus(found, position) {
    const status = document.getElementById('searchStatus');
    const searchPosition = document.getElementById('searchPosition');
    
    if (found) {
        status.textContent = '已找到';
        status.className = 'text-green-400';
        searchPosition.textContent = position;
    } else {
        status.textContent = '未找到';
        status.className = 'text-red-400';
        searchPosition.textContent = '-1';
        
        // 标记所有元素为未找到
        for (let i = 0; i < searchArraySize; i++) {
            const element = document.getElementById(`search-element-${i}`);
            if (element) {
                element.className = 'array-element not-found';
            }
        }
    }
}

// 添加搜索步骤
function addSearchStep(step) {
    const stepsContainer = document.getElementById('searchSteps');
    const stepElement = document.createElement('div');
    stepElement.className = 'step-indicator';
    stepElement.innerHTML = `<span class="text-gray-300">${step}</span>`;
    
    stepsContainer.appendChild(stepElement);
    
    // 自动滚动到底部
    stepsContainer.scrollTop = stepsContainer.scrollHeight;
    
    // 限制步骤数量，避免内存泄漏
    if (stepsContainer.children.length > 50) {
        stepsContainer.removeChild(stepsContainer.firstChild);
    }
}

// 清除搜索步骤
function clearSearchSteps() {
    const stepsContainer = document.getElementById('searchSteps');
    stepsContainer.innerHTML = '<div class="text-gray-400">点击"开始搜索"查看详细的搜索步骤...</div>';
}

// 更新搜索统计信息
function updateSearchStatistics() {
    document.getElementById('comparisons').textContent = searchComparisons;
}

// 重置搜索统计信息
function resetSearchStatistics() {
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('searchPosition').textContent = '-1';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('currentArraySize').textContent = searchArraySize;
    document.getElementById('searchStatus').textContent = '就绪';
    document.getElementById('searchStatus').className = 'text-gray-400';
}

// 获取搜索动画延迟
function getSearchAnimationDelay() {
    return Math.max(100, 1200 - searchAnimationSpeed * 100);
}

// 工具函数：睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出函数供其他文件使用
window.SearchAlgorithms = {
    initializeSearchPage,
    startSearch,
    stopSearch
};