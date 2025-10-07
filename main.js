// 主要JavaScript逻辑文件
// 包含通用功能和页面初始化

// 全局变量
let currentArray = [];
let isSorting = false;
let animationSpeed = 5;
let arraySize = 50;

// 初始化排序页面
function initializeSortingPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateAlgorithmInfo);
    document.getElementById('arraySize').addEventListener('input', updateArraySize);
    document.getElementById('speed').addEventListener('input', updateSpeed);
    document.getElementById('generateArray').addEventListener('click', generateNewArray);
    document.getElementById('startSort').addEventListener('click', startSorting);
    document.getElementById('stopSort').addEventListener('click', stopSorting);
    
    // 初始化数组
    generateNewArray();
    updateAlgorithmInfo();
    
    // 初始化动画
    initializeAnimations();
}

// 生成新的随机数组
function generateNewArray() {
    if (isSorting) return;
    
    currentArray = [];
    const minValue = 10;
    const maxValue = 400;
    
    for (let i = 0; i < arraySize; i++) {
        currentArray.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    }
    
    displayArray();
    resetStatistics();
}

// 显示数组可视化
function displayArray() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = '';
    
    const maxValue = Math.max(...currentArray);
    const containerHeight = container.clientHeight - 20;
    
    currentArray.forEach((value, index) => {
        const bar = document.createElement('div');
        const height = (value / maxValue) * containerHeight;
        
        bar.className = 'array-bar';
        bar.style.height = `${height}px`;
        bar.style.width = `${Math.max(2, (container.clientWidth - 40) / arraySize - 1)}px`;
        bar.style.background = `linear-gradient(to top, #00d4ff, #4ecdc4)`;
        bar.style.marginRight = '1px';
        bar.id = `bar-${index}`;
        
        // 添加数值标签
        const label = document.createElement('div');
        label.textContent = value;
        label.style.position = 'absolute';
        label.style.bottom = '-20px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.fontSize = '10px';
        label.style.color = '#b0b0b0';
        label.style.display = arraySize <= 20 ? 'block' : 'none';
        
        bar.style.position = 'relative';
        bar.appendChild(label);
        
        container.appendChild(bar);
    });
}

// 更新数组大小
function updateArraySize() {
    const sizeSlider = document.getElementById('arraySize');
    const sizeValue = document.getElementById('arraySizeValue');
    
    arraySize = parseInt(sizeSlider.value);
    sizeValue.textContent = arraySize;
    
    generateNewArray();
}

// 更新动画速度
function updateSpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    animationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = animationSpeed;
}

// 更新算法信息
function updateAlgorithmInfo() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const description = document.getElementById('algorithmDescription');
    const bestCase = document.getElementById('bestCase');
    const averageCase = document.getElementById('averageCase');
    const worstCase = document.getElementById('worstCase');
    const spaceComplexity = document.getElementById('spaceComplexity');
    const stability = document.getElementById('stability');
    const code = document.getElementById('algorithmCode');
    
    const algorithmInfo = {
        bubble: {
            description: '冒泡排序是一种简单的排序算法，通过重复遍历数组，比较相邻元素并交换位置，使较大的元素逐渐"冒泡"到数组末尾。虽然效率不高，但是稳定排序，适合教学使用。',
            bestCase: 'O(n)',
            averageCase: 'O(n²)',
            worstCase: 'O(n²)',
            spaceComplexity: 'O(1)',
            stability: '稳定',
            code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break; // 优化：如果没有交换，提前结束
    }
    return arr;
}`
        },
        selection: {
            description: '选择排序每次从未排序部分选择最小元素，放到已排序部分的末尾。虽然交换次数较少，但比较次数固定，不稳定排序。',
            bestCase: 'O(n²)',
            averageCase: 'O(n²)',
            worstCase: 'O(n²)',
            spaceComplexity: 'O(1)',
            stability: '不稳定',
            code: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            // 交换元素
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    return arr;
}`
        },
        insertion: {
            description: '插入排序将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的适当位置。对于部分有序数组效率很高。',
            bestCase: 'O(n)',
            averageCase: 'O(n²)',
            worstCase: 'O(n²)',
            spaceComplexity: 'O(1)',
            stability: '稳定',
            code: `function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`
        },
        merge: {
            description: '归并排序采用分治策略，将数组分成两半，递归排序后再合并。时间复杂度稳定为O(nlogn)，但需要额外空间。',
            bestCase: 'O(nlogn)',
            averageCase: 'O(nlogn)',
            worstCase: 'O(nlogn)',
            spaceComplexity: 'O(n)',
            stability: '稳定',
            code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let leftIndex = 0, rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}`
        },
        quick: {
            description: '快速排序选择基准元素，将数组分为小于和大于基准的两部分，递归排序。平均性能极佳，但最坏情况下为O(n²)。',
            bestCase: 'O(nlogn)',
            averageCase: 'O(nlogn)',
            worstCase: 'O(n²)',
            spaceComplexity: 'O(logn)',
            stability: '不稳定',
            code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`
        },
        heap: {
            description: '堆排序利用堆数据结构，首先构建最大堆，然后重复取出堆顶元素。时间复杂度稳定为O(nlogn)，空间效率高。',
            bestCase: 'O(nlogn)',
            averageCase: 'O(nlogn)',
            worstCase: 'O(nlogn)',
            spaceComplexity: 'O(1)',
            stability: '不稳定',
            code: `function heapSort(arr) {
    const n = arr.length;
    
    // 构建最大堆
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // 一个个从堆中取出元素
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]]; // 交换
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}`
        }
    };
    
    const info = algorithmInfo[algorithm];
    if (info) {
        description.textContent = info.description;
        bestCase.textContent = info.bestCase;
        averageCase.textContent = info.averageCase;
        worstCase.textContent = info.worstCase;
        spaceComplexity.textContent = info.spaceComplexity;
        stability.textContent = info.stability;
        code.textContent = info.code;
    }
}

// 重置统计信息
function resetStatistics() {
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('currentArraySize').textContent = arraySize;
}

// 初始化动画
function initializeAnimations() {
    // 页面加载动画
    anime({
        targets: '.performance-card',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
}

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('bg-gray-900/95');
    } else {
        nav.classList.remove('bg-gray-900/95');
    }
});

// 工具函数：睡眠函数用于动画控制
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 工具函数：获取动画延迟时间
function getAnimationDelay() {
    return Math.max(50, 1100 - animationSpeed * 100);
}

// 导出函数供其他文件使用
window.AlgorithmUtils = {
    currentArray,
    isSorting,
    animationSpeed,
    arraySize,
    generateNewArray,
    displayArray,
    sleep,
    getAnimationDelay,
    resetStatistics
};