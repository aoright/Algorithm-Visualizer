// 图论算法实现和可视化控制
// 包含BFS、DFS、Dijkstra等图算法的具体实现和动画控制

// 全局变量
let graphNodes = [];
let graphEdges = [];
let graphAdjacencyList = {};
let isGraphRunning = false;
let graphAnimationSpeed = 5;
let nodeCount = 8;
let visitedNodes = 0;
let algorithmStartTime = 0;

// 初始化图页面
function initializeGraphPage() {
    // 绑定事件监听器
    document.getElementById('algorithmSelect').addEventListener('change', updateGraphAlgorithmInfo);
    document.getElementById('nodeCount').addEventListener('input', updateNodeCount);
    document.getElementById('speed').addEventListener('input', updateGraphSpeed);
    document.getElementById('generateGraph').addEventListener('click', generateNewGraph);
    document.getElementById('startAlgorithm').addEventListener('click', startGraphAlgorithm);
    document.getElementById('clearGraph').addEventListener('click', clearGraph);
    document.getElementById('addRandomEdges').addEventListener('click', addRandomEdges);
    document.getElementById('resetWeights').addEventListener('click', resetEdgeWeights);
    
    // 初始化图
    generateNewGraph();
    updateGraphAlgorithmInfo();
}

// 生成新的图
function generateNewGraph() {
    if (isGraphRunning) return;
    
    clearGraph();
    
    const canvas = document.getElementById('graphCanvas');
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    
    // 生成节点
    graphNodes = [];
    for (let i = 0; i < nodeCount; i++) {
        const angle = (2 * Math.PI * i) / nodeCount;
        const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
        const x = canvasWidth / 2 + radius * Math.cos(angle - Math.PI / 2);
        const y = canvasHeight / 2 + radius * Math.sin(angle - Math.PI / 2);
        
        graphNodes.push({
            id: i,
            x: x,
            y: y,
            label: String.fromCharCode(65 + i) // A, B, C, ...
        });
    }
    
    // 生成边（创建连通图）
    graphEdges = [];
    graphAdjacencyList = {};
    
    // 初始化邻接表
    graphNodes.forEach(node => {
        graphAdjacencyList[node.id] = [];
    });
    
    // 创建环形连接
    for (let i = 0; i < nodeCount; i++) {
        const from = i;
        const to = (i + 1) % nodeCount;
        const weight = Math.floor(Math.random() * 10) + 1;
        
        addEdgeToGraph(from, to, weight);
    }
    
    // 添加一些随机边
    const extraEdges = Math.floor(nodeCount * 0.5);
    for (let i = 0; i < extraEdges; i++) {
        const from = Math.floor(Math.random() * nodeCount);
        const to = Math.floor(Math.random() * nodeCount);
        
        if (from !== to && !edgeExists(from, to)) {
            const weight = Math.floor(Math.random() * 10) + 1;
            addEdgeToGraph(from, to, weight);
        }
    }
    
    displayGraph();
    updateNodeSelectors();
    resetGraphStatistics();
    clearAlgorithmSteps();
}

// 添加边到图
function addEdgeToGraph(from, to, weight) {
    const edgeId = `${Math.min(from, to)}-${Math.max(from, to)}`;
    
    graphEdges.push({
        id: edgeId,
        from: from,
        to: to,
        weight: weight
    });
    
    // 无向图，双向添加
    graphAdjacencyList[from].push({ node: to, weight: weight });
    graphAdjacencyList[to].push({ node: from, weight: weight });
}

// 检查边是否存在
function edgeExists(from, to) {
    const edgeId1 = `${from}-${to}`;
    const edgeId2 = `${to}-${from}`;
    
    return graphEdges.some(edge => edge.id === edgeId1 || edge.id === edgeId2);
}

// 显示图
function displayGraph() {
    const canvas = document.getElementById('graphCanvas');
    canvas.innerHTML = '';
    
    // 显示边
    graphEdges.forEach(edge => {
        const fromNode = graphNodes[edge.from];
        const toNode = graphNodes[edge.to];
        
        const edgeElement = document.createElement('div');
        edgeElement.className = 'graph-edge';
        edgeElement.id = `edge-${edge.id}`;
        
        const length = Math.sqrt(Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2));
        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
        
        edgeElement.style.width = `${length}px`;
        edgeElement.style.left = `${fromNode.x}px`;
        edgeElement.style.top = `${fromNode.y}px`;
        edgeElement.style.transform = `rotate(${angle}rad)`;
        
        canvas.appendChild(edgeElement);
        
        // 显示权重
        const weightElement = document.createElement('div');
        weightElement.className = 'edge-weight';
        weightElement.id = `weight-${edge.id}`;
        weightElement.textContent = edge.weight;
        weightElement.style.left = `${(fromNode.x + toNode.x) / 2 - 10}px`;
        weightElement.style.top = `${(fromNode.y + toNode.y) / 2 - 10}px`;
        
        canvas.appendChild(weightElement);
    });
    
    // 显示节点
    graphNodes.forEach(node => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'graph-node';
        nodeElement.id = `node-${node.id}`;
        nodeElement.textContent = node.label;
        nodeElement.style.left = `${node.x - 20}px`;
        nodeElement.style.top = `${node.y - 20}px`;
        
        canvas.appendChild(nodeElement);
    });
}

// 更新节点选择器
function updateNodeSelectors() {
    const startSelect = document.getElementById('startNode');
    const endSelect = document.getElementById('endNode');
    
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    graphNodes.forEach(node => {
        const option1 = document.createElement('option');
        option1.value = node.id;
        option1.textContent = node.label;
        startSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = node.id;
        option2.textContent = node.label;
        endSelect.appendChild(option2);
    });
    
    // 默认选择第一个和最后一个节点
    if (graphNodes.length > 1) {
        endSelect.value = graphNodes.length - 1;
    }
}

// 更新节点数量
function updateNodeCount() {
    const nodeCountSlider = document.getElementById('nodeCount');
    const nodeCountValue = document.getElementById('nodeCountValue');
    
    nodeCount = parseInt(nodeCountSlider.value);
    nodeCountValue.textContent = nodeCount;
    
    generateNewGraph();
}

// 更新图动画速度
function updateGraphSpeed() {
    const speedSlider = document.getElementById('speed');
    const speedValue = document.getElementById('speedValue');
    
    graphAnimationSpeed = parseInt(speedSlider.value);
    speedValue.textContent = graphAnimationSpeed;
}

// 更新图算法信息
function updateGraphAlgorithmInfo() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const code = document.getElementById('algorithmCode');
    
    const algorithmInfo = {
        bfs: {
            code: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return result;
}`
        },
        dfs: {
            code: `function dfs(graph, start, visited = new Set()) {
    const result = [];
    
    function dfsHelper(node) {
        visited.add(node);
        result.push(node);
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                dfsHelper(neighbor);
            }
        }
    }
    
    dfsHelper(start);
    return result;
}`
        },
        dijkstra: {
            code: `function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // 初始化
    for (const node in graph) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
        unvisited.add(node);
    }
    
    while (unvisited.size > 0) {
        // 找到距离最小的节点
        const current = [...unvisited].reduce((a, b) => 
            distances[a] < distances[b] ? a : b
        );
        
        unvisited.delete(current);
        
        if (current === end) break;
        
        // 更新邻居距离
        for (const {node, weight} of graph[current]) {
            const alt = distances[current] + weight;
            if (alt < distances[node]) {
                distances[node] = alt;
                previous[node] = current;
            }
        }
    }
    
    return { distances, previous };
}`
        }
    };
    
    const info = algorithmInfo[algorithm];
    if (info) {
        code.textContent = info.code;
    }
}

// 开始图算法
async function startGraphAlgorithm() {
    if (isGraphRunning) return;
    
    const startNode = parseInt(document.getElementById('startNode').value);
    const endNode = parseInt(document.getElementById('endNode').value);
    const algorithm = document.getElementById('algorithmSelect').value;
    
    isGraphRunning = true;
    algorithmStartTime = Date.now();
    visitedNodes = 0;
    
    // 禁用控制按钮
    document.getElementById('startAlgorithm').disabled = true;
    document.getElementById('generateGraph').disabled = true;
    document.getElementById('clearGraph').disabled = true;
    
    // 清除之前的结果
    clearAlgorithmSteps();
    resetGraphNodeColors();
    
    try {
        switch (algorithm) {
            case 'bfs':
                await bfsVisualization(startNode, endNode);
                break;
            case 'dfs':
                await dfsVisualization(startNode, endNode);
                break;
            case 'dijkstra':
                await dijkstraVisualization(startNode, endNode);
                break;
        }
    } catch (error) {
        console.error('算法执行过程中出现错误:', error);
    } finally {
        isGraphRunning = false;
        
        // 重新启用控制按钮
        document.getElementById('startAlgorithm').disabled = false;
        document.getElementById('generateGraph').disabled = false;
        document.getElementById('clearGraph').disabled = false;
        
        // 更新执行时间
        const executionTime = Date.now() - algorithmStartTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
    }
}

// BFS可视化
async function bfsVisualization(start, end) {
    addAlgorithmStep(`开始广度优先搜索，从节点 ${graphNodes[start].label} 开始`);
    
    const visited = new Set();
    const queue = [start];
    const parent = {};
    
    visited.add(start);
    parent[start] = null;
    
    // 标记起始节点
    highlightGraphNode(start, 'start');
    await sleep(getGraphAnimationDelay());
    
    while (queue.length > 0 && isGraphRunning) {
        const current = queue.shift();
        visitedNodes++;
        updateGraphStatistics();
        
        addAlgorithmStep(`访问节点 ${graphNodes[current].label}，已访问 ${visitedNodes} 个节点`);
        
        // 高亮当前节点
        if (current !== start) {
            highlightGraphNode(current, 'visiting');
        }
        
        await sleep(getGraphAnimationDelay());
        
        if (current === end) {
            addAlgorithmStep(`找到目标节点 ${graphNodes[end].label}！`);
            highlightGraphNode(end, 'end');
            await highlightPath(parent, start, end);
            return;
        }
        
        // 访问邻居节点
        for (const neighbor of graphAdjacencyList[current]) {
            if (!visited.has(neighbor.node)) {
                visited.add(neighbor.node);
                parent[neighbor.node] = current;
                queue.push(neighbor.node);
                
                // 高亮边
                highlightEdge(current, neighbor.node, 'current');
                addAlgorithmStep(`将节点 ${graphNodes[neighbor.node].label} 加入队列`);
                
                await sleep(getGraphAnimationDelay());
                
                resetEdgeColor(current, neighbor.node);
            }
        }
        
        // 标记为已访问
        if (current !== start) {
            highlightGraphNode(current, 'visited');
        }
    }
    
    addAlgorithmStep('BFS完成，未找到目标节点');
}

// DFS可视化
async function dfsVisualization(start, end) {
    addAlgorithmStep(`开始深度优先搜索，从节点 ${graphNodes[start].label} 开始`);
    
    const visited = new Set();
    const parent = {};
    
    // 标记起始节点
    highlightGraphNode(start, 'start');
    await sleep(getGraphAnimationDelay());
    
    async function dfsHelper(current) {
        if (!isGraphRunning) return false;
        
        visited.add(current);
        visitedNodes++;
        updateGraphStatistics();
        
        addAlgorithmStep(`访问节点 ${graphNodes[current].label}，已访问 ${visitedNodes} 个节点`);
        
        // 高亮当前节点
        if (current !== start) {
            highlightGraphNode(current, 'visiting');
        }
        
        await sleep(getGraphAnimationDelay());
        
        if (current === end) {
            addAlgorithmStep(`找到目标节点 ${graphNodes[end].label}！`);
            highlightGraphNode(end, 'end');
            return true;
        }
        
        // 访问邻居节点
        for (const neighbor of graphAdjacencyList[current]) {
            if (!visited.has(neighbor.node)) {
                parent[neighbor.node] = current;
                
                // 高亮边
                highlightEdge(current, neighbor.node, 'current');
                addAlgorithmStep(`递归访问节点 ${graphNodes[neighbor.node].label}`);
                
                await sleep(getGraphAnimationDelay());
                
                if (await dfsHelper(neighbor.node)) {
                    return true;
                }
                
                resetEdgeColor(current, neighbor.node);
            }
        }
        
        // 标记为已访问
        if (current !== start) {
            highlightGraphNode(current, 'visited');
        }
        
        return false;
    }
    
    const found = await dfsHelper(start);
    
    if (found) {
        await highlightPath(parent, start, end);
    } else {
        addAlgorithmStep('DFS完成，未找到目标节点');
    }
}

// Dijkstra算法可视化
async function dijkstraVisualization(start, end) {
    addAlgorithmStep(`开始Dijkstra算法，从节点 ${graphNodes[start].label} 到 ${graphNodes[end].label}`);
    
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // 初始化
    graphNodes.forEach(node => {
        distances[node.id] = node.id === start ? 0 : Infinity;
        previous[node.id] = null;
        unvisited.add(node.id);
    });
    
    // 标记起始节点
    highlightGraphNode(start, 'start');
    addAlgorithmStep(`初始化：节点 ${graphNodes[start].label} 的距离为 0`);
    
    while (unvisited.size > 0 && isGraphRunning) {
        // 找到距离最小的节点
        let current = null;
        let minDistance = Infinity;
        
        for (const node of unvisited) {
            if (distances[node] < minDistance) {
                minDistance = distances[node];
                current = node;
            }
        }
        
        if (current === null) break;
        
        unvisited.delete(current);
        visitedNodes++;
        updateGraphStatistics();
        
        addAlgorithmStep(`选择距离最小的节点 ${graphNodes[current].label}，当前距离: ${distances[current]}`);
        
        // 高亮当前节点
        if (current !== start) {
            highlightGraphNode(current, 'visiting');
        }
        
        await sleep(getGraphAnimationDelay());
        
        if (current === end) {
            addAlgorithmStep(`到达目标节点 ${graphNodes[end].label}，最短距离: ${distances[end]}`);
            highlightGraphNode(end, 'end');
            await highlightPath(previous, start, end);
            return;
        }
        
        // 更新邻居距离
        for (const {node: neighbor, weight} of graphAdjacencyList[current]) {
            if (unvisited.has(neighbor)) {
                const alt = distances[current] + weight;
                
                addAlgorithmStep(`检查邻居节点 ${graphNodes[neighbor].label}，通过 ${graphNodes[current].label} 的距离: ${alt}`);
                
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = current;
                    
                    addAlgorithmStep(`更新节点 ${graphNodes[neighbor].label} 的最短距离为 ${alt}`);
                    
                    // 高亮边
                    highlightEdge(current, neighbor, 'current');
                    await sleep(getGraphAnimationDelay());
                    resetEdgeColor(current, neighbor);
                }
            }
        }
        
        // 标记为已访问
        if (current !== start) {
            highlightGraphNode(current, 'visited');
        }
    }
    
    addAlgorithmStep('Dijkstra算法完成，未找到路径');
}

// 高亮图节点
function highlightGraphNode(nodeId, type) {
    const nodeElement = document.getElementById(`node-${nodeId}`);
    if (nodeElement) {
        nodeElement.className = `graph-node ${type}`;
    }
}

// 高亮边
function highlightEdge(from, to, type) {
    const edgeId = `${Math.min(from, to)}-${Math.max(from, to)}`;
    const edgeElement = document.getElementById(`edge-${edgeId}`);
    if (edgeElement) {
        edgeElement.className = `graph-edge ${type}`;
    }
}

// 重置边颜色
function resetEdgeColor(from, to) {
    const edgeId = `${Math.min(from, to)}-${Math.max(from, to)}`;
    const edgeElement = document.getElementById(`edge-${edgeId}`);
    if (edgeElement) {
        edgeElement.className = 'graph-edge';
    }
}

// 高亮路径
async function highlightPath(parent, start, end) {
    const path = [];
    let current = end;
    
    while (current !== null) {
        path.unshift(current);
        current = parent[current];
    }
    
    if (path[0] === start) {
        addAlgorithmStep(`找到路径，长度为 ${path.length} 个节点`);
        document.getElementById('pathLength').textContent = path.length;
        
        // 高亮路径
        for (let i = 0; i < path.length - 1; i++) {
            highlightEdge(path[i], path[i + 1], 'visited');
            if (i < path.length - 1) {
                await sleep(getGraphAnimationDelay() / 2);
            }
        }
    }
}

// 重置图节点颜色
function resetGraphNodeColors() {
    graphNodes.forEach(node => {
        const nodeElement = document.getElementById(`node-${node.id}`);
        if (nodeElement) {
            nodeElement.className = 'graph-node';
        }
    });
    
    graphEdges.forEach(edge => {
        const edgeElement = document.getElementById(`edge-${edge.id}`);
        if (edgeElement) {
            edgeElement.className = 'graph-edge';
        }
    });
}

// 清除图
function clearGraph() {
    const canvas = document.getElementById('graphCanvas');
    canvas.innerHTML = '';
    
    graphNodes = [];
    graphEdges = [];
    graphAdjacencyList = {};
    
    resetGraphStatistics();
    clearAlgorithmSteps();
}

// 添加随机边
function addRandomEdges() {
    if (isGraphRunning) return;
    
    const extraEdges = Math.floor(nodeCount * 0.3);
    let addedEdges = 0;
    
    for (let i = 0; i < extraEdges * 3 && addedEdges < extraEdges; i++) {
        const from = Math.floor(Math.random() * nodeCount);
        const to = Math.floor(Math.random() * nodeCount);
        
        if (from !== to && !edgeExists(from, to)) {
            const weight = Math.floor(Math.random() * 10) + 1;
            addEdgeToGraph(from, to, weight);
            addedEdges++;
        }
    }
    
    displayGraph();
}

// 重置边权重
function resetEdgeWeights() {
    if (isGraphRunning) return;
    
    graphEdges.forEach(edge => {
        edge.weight = Math.floor(Math.random() * 10) + 1;
        
        const weightElement = document.getElementById(`weight-${edge.id}`);
        if (weightElement) {
            weightElement.textContent = edge.weight;
        }
    });
}

// 添加算法步骤
function addAlgorithmStep(step) {
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
function clearAlgorithmSteps() {
    const stepsContainer = document.getElementById('algorithmSteps');
    stepsContainer.innerHTML = '<div class="text-gray-400">点击"开始"查看详细的算法执行步骤...</div>';
}

// 更新图统计信息
function updateGraphStatistics() {
    document.getElementById('visitedNodes').textContent = visitedNodes;
    document.getElementById('totalNodes').textContent = nodeCount;
}

// 重置图统计信息
function resetGraphStatistics() {
    document.getElementById('visitedNodes').textContent = '0';
    document.getElementById('pathLength').textContent = '0';
    document.getElementById('executionTime').textContent = '0ms';
    document.getElementById('totalNodes').textContent = nodeCount;
    document.getElementById('algorithmStatus').textContent = '就绪';
}

// 获取图动画延迟
function getGraphAnimationDelay() {
    return Math.max(200, 1500 - graphAnimationSpeed * 100);
}

// 工具函数：睡眠函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出函数供其他文件使用
window.GraphAlgorithms = {
    initializeGraphPage,
    startGraphAlgorithm,
    clearGraph
};