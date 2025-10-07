// 排序算法实现和可视化控制
// 包含各种排序算法的具体实现和动画控制

// 统计变量
let comparisons = 0;
let swaps = 0;
let startTime = 0;

// 开始排序
async function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    startTime = Date.now();
    comparisons = 0;
    swaps = 0;
    
    const algorithm = document.getElementById('algorithmSelect').value;
    
    // 禁用控制按钮
    document.getElementById('startSort').disabled = true;
    document.getElementById('generateArray').disabled = true;
    
    try {
        switch (algorithm) {
            case 'bubble':
                await bubbleSortVisualization([...currentArray]);
                break;
            case 'selection':
                await selectionSortVisualization([...currentArray]);
                break;
            case 'insertion':
                await insertionSortVisualization([...currentArray]);
                break;
            case 'merge':
                await mergeSortVisualization([...currentArray]);
                break;
            case 'quick':
                await quickSortVisualization([...currentArray]);
                break;
            case 'heap':
                await heapSortVisualization([...currentArray]);
                break;
        }
        
        // 标记所有元素为已排序
        await markAllSorted();
        
    } catch (error) {
        console.error('排序过程中出现错误:', error);
    } finally {
        isSorting = false;
        
        // 重新启用控制按钮
        document.getElementById('startSort').disabled = false;
        document.getElementById('generateArray').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - startTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// 停止排序
function stopSorting() {
    isSorting = false;
    document.getElementById('startSort').disabled = false;
    document.getElementById('generateArray').disabled = false;
}

// 冒泡排序可视化
async function bubbleSortVisualization(array) {
    const n = array.length;
    
    for (let i = 0; i < n - 1 && isSorting; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1 && isSorting; j++) {
            // 高亮比较的元素
            highlightBars([j, j + 1], 'comparing');
            comparisons++;
            updateStatistics();
            
            await sleep(getAnimationDelay());
            
            if (array[j] > array[j + 1]) {
                // 交换元素
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                swaps++;
                
                // 高亮交换的元素
                highlightBars([j, j + 1], 'swapping');
                updateArrayDisplay(array);
                
                await sleep(getAnimationDelay());
            }
            
            // 重置颜色
            resetBarColors([j, j + 1]);
        }
        
        // 标记已排序的元素
        highlightBars([n - i - 1], 'sorted');
        
        if (!swapped) break; // 优化：如果没有交换，提前结束
    }
    
    return array;
}

// 选择排序可视化
async function selectionSortVisualization(array) {
    const n = array.length;
    
    for (let i = 0; i < n - 1 && isSorting; i++) {
        let minIndex = i;
        
        // 高亮当前最小值
        highlightBars([minIndex], 'comparing');
        
        for (let j = i + 1; j < n && isSorting; j++) {
            // 高亮比较的元素
            highlightBars([j], 'comparing');
            comparisons++;
            updateStatistics();
            
            await sleep(getAnimationDelay());
            
            if (array[j] < array[minIndex]) {
                // 重置之前的最小值颜色
                resetBarColors([minIndex]);
                minIndex = j;
                // 高亮新的最小值
                highlightBars([minIndex], 'comparing');
            } else {
                resetBarColors([j]);
            }
        }
        
        if (minIndex !== i) {
            // 交换元素
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swaps++;
            
            // 高亮交换的元素
            highlightBars([i, minIndex], 'swapping');
            updateArrayDisplay(array);
            
            await sleep(getAnimationDelay());
        }
        
        // 标记已排序的元素
        highlightBars([i], 'sorted');
        resetBarColors([minIndex]);
        
        updateStatistics();
    }
    
    // 标记最后一个元素
    highlightBars([n - 1], 'sorted');
    
    return array;
}

// 插入排序可视化
async function insertionSortVisualization(array) {
    const n = array.length;
    
    // 第一个元素默认已排序
    highlightBars([0], 'sorted');
    
    for (let i = 1; i < n && isSorting; i++) {
        const key = array[i];
        let j = i - 1;
        
        // 高亮当前要插入的元素
        highlightBars([i], 'comparing');
        await sleep(getAnimationDelay());
        
        while (j >= 0 && array[j] > key && isSorting) {
            // 高亮比较的元素
            highlightBars([j], 'comparing');
            comparisons++;
            
            array[j + 1] = array[j];
            swaps++;
            
            updateArrayDisplay(array);
            updateStatistics();
            
            await sleep(getAnimationDelay());
            
            resetBarColors([j + 1]);
            j--;
        }
        
        array[j + 1] = key;
        updateArrayDisplay(array);
        
        // 标记已排序的部分
        for (let k = 0; k <= i; k++) {
            highlightBars([k], 'sorted');
        }
        
        await sleep(getAnimationDelay());
    }
    
    return array;
}

// 归并排序可视化
async function mergeSortVisualization(array) {
    await mergeSortHelper(array, 0, array.length - 1);
    return array;
}

async function mergeSortHelper(array, left, right) {
    if (left >= right || !isSorting) return;
    
    const mid = Math.floor((left + right) / 2);
    
    // 递归排序左半部分
    await mergeSortHelper(array, left, mid);
    
    // 递归排序右半部分
    await mergeSortHelper(array, mid + 1, right);
    
    // 合并两个有序部分
    await merge(array, left, mid, right);
}

async function merge(array, left, mid, right) {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);
    
    let leftIndex = 0, rightIndex = 0;
    let arrayIndex = left;
    
    while (leftIndex < leftArray.length && rightIndex < rightArray.length && isSorting) {
        comparisons++;
        updateStatistics();
        
        // 高亮比较的元素
        const leftPos = left + leftIndex;
        const rightPos = mid + 1 + rightIndex;
        highlightBars([leftPos, rightPos], 'comparing');
        
        await sleep(getAnimationDelay());
        
        if (leftArray[leftIndex] <= rightArray[rightIndex]) {
            array[arrayIndex] = leftArray[leftIndex];
            leftIndex++;
        } else {
            array[arrayIndex] = rightArray[rightIndex];
            rightIndex++;
        }
        
        swaps++;
        updateArrayDisplay(array);
        
        // 高亮放置的元素
        highlightBars([arrayIndex], 'swapping');
        await sleep(getAnimationDelay());
        
        resetBarColors([arrayIndex]);
        arrayIndex++;
    }
    
    // 处理剩余元素
    while (leftIndex < leftArray.length && isSorting) {
        array[arrayIndex] = leftArray[leftIndex];
        updateArrayDisplay(array);
        
        highlightBars([arrayIndex], 'swapping');
        await sleep(getAnimationDelay());
        resetBarColors([arrayIndex]);
        
        leftIndex++;
        arrayIndex++;
        swaps++;
    }
    
    while (rightIndex < rightArray.length && isSorting) {
        array[arrayIndex] = rightArray[rightIndex];
        updateArrayDisplay(array);
        
        highlightBars([arrayIndex], 'swapping');
        await sleep(getAnimationDelay());
        resetBarColors([arrayIndex]);
        
        rightIndex++;
        arrayIndex++;
        swaps++;
    }
    
    // 标记已排序的部分
    for (let i = left; i <= right && isSorting; i++) {
        highlightBars([i], 'sorted');
    }
}

// 快速排序可视化
async function quickSortVisualization(array) {
    await quickSortHelper(array, 0, array.length - 1);
    return array;
}

async function quickSortHelper(array, low, high) {
    if (low < high && isSorting) {
        const pivotIndex = await partition(array, low, high);
        
        // 递归排序左半部分
        await quickSortHelper(array, low, pivotIndex - 1);
        
        // 递归排序右半部分
        await quickSortHelper(array, pivotIndex + 1, high);
    }
}

async function partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;
    
    // 高亮基准元素
    highlightBars([high], 'comparing');
    await sleep(getAnimationDelay());
    
    for (let j = low; j < high && isSorting; j++) {
        comparisons++;
        updateStatistics();
        
        // 高亮当前比较的元素
        highlightBars([j], 'comparing');
        await sleep(getAnimationDelay());
        
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                // 交换元素
                [array[i], array[j]] = [array[j], array[i]];
                swaps++;
                
                // 高亮交换的元素
                highlightBars([i, j], 'swapping');
                updateArrayDisplay(array);
                
                await sleep(getAnimationDelay());
            }
        }
        
        resetBarColors([j]);
    }
    
    // 将基准元素放到正确位置
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    
    // 高亮最终交换
    highlightBars([i + 1, high], 'swapping');
    updateArrayDisplay(array);
    
    await sleep(getAnimationDelay());
    
    // 标记已排序的基准元素
    highlightBars([i + 1], 'sorted');
    
    return i + 1;
}

// 堆排序可视化
async function heapSortVisualization(array) {
    const n = array.length;
    
    // 构建最大堆
    for (let i = Math.floor(n / 2) - 1; i >= 0 && isSorting; i--) {
        await heapify(array, n, i);
    }
    
    // 一个个从堆中取出元素
    for (let i = n - 1; i > 0 && isSorting; i--) {
        // 将堆顶元素与最后一个元素交换
        [array[0], array[i]] = [array[i], array[0]];
        swaps++;
        
        // 高亮交换的元素
        highlightBars([0, i], 'swapping');
        updateArrayDisplay(array);
        
        await sleep(getAnimationDelay());
        
        // 标记已排序的元素
        highlightBars([i], 'sorted');
        
        // 重新构建堆
        await heapify(array, i, 0);
    }
    
    // 标记最后一个元素
    highlightBars([0], 'sorted');
    
    return array;
}

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
        comparisons++;
        if (array[left] > array[largest]) {
            largest = left;
        }
    }
    
    if (right < n) {
        comparisons++;
        if (array[right] > array[largest]) {
            largest = right;
        }
    }
    
    updateStatistics();
    
    // 高亮比较的元素
    const compareIndices = [i];
    if (left < n) compareIndices.push(left);
    if (right < n) compareIndices.push(right);
    highlightBars(compareIndices, 'comparing');
    
    await sleep(getAnimationDelay());
    
    if (largest !== i) {
        // 交换元素
        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;
        
        // 高亮交换的元素
        highlightBars([i, largest], 'swapping');
        updateArrayDisplay(array);
        
        await sleep(getAnimationDelay());
        
        // 递归地堆化受影响的子树
        await heapify(array, n, largest);
    }
    
    resetBarColors(compareIndices);
}

// 高亮显示柱状图
function highlightBars(indices, type) {
    indices.forEach(index => {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.className = `array-bar ${type}`;
        }
    });
}

// 重置柱状图颜色
function resetBarColors(indices) {
    indices.forEach(index => {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            bar.className = 'array-bar';
        }
    });
}

// 更新数组显示
function updateArrayDisplay(array) {
    const maxValue = Math.max(...array);
    const containerHeight = document.getElementById('arrayContainer').clientHeight - 20;
    
    array.forEach((value, index) => {
        const bar = document.getElementById(`bar-${index}`);
        if (bar) {
            const height = (value / maxValue) * containerHeight;
            bar.style.height = `${height}px`;
            
            // 更新标签
            const label = bar.querySelector('div');
            if (label) {
                label.textContent = value;
            }
        }
    });
}

// 更新统计信息
function updateStatistics() {
    document.getElementById('comparisons').textContent = comparisons;
    document.getElementById('swaps').textContent = swaps;
}

// 标记所有元素为已排序
async function markAllSorted() {
    const indices = [];
    for (let i = 0; i < arraySize; i++) {
        indices.push(i);
    }
    
    for (let i = 0; i < indices.length; i++) {
        highlightBars([indices[i]], 'sorted');
        if (i % 5 === 0) { // 每5个元素暂停一下，创建波浪效果
            await sleep(50);
        }
    }
}

// 导出函数供其他文件使用
window.SortingAlgorithms = {
    startSorting,
    stopSorting
};