import { createApp, ref, reactive, nextTick, onMounted } from 'vue';
import ElementPlus from 'element-plus';

// 导入真实的组件和工具函数
import JsonEditor from '@/JsonEditor.vue';
import {
    mergeFieldsSuper,
    pickFieldsSuper,
    findReadonlyFieldRanges,
    isReadonlyValueChanged
} from '@/utils/index';

const App = {
    components: {
        JsonEditor
    },

    template: `
        <div class="app-container">
            <div class="header">
                <h1>
                    <i class="el-icon-document"></i>
                    JSON Editor Vue3 示例
                </h1>
                <p>这是一个真实的 JSON Editor Vue3 组件示例，展示完整的编辑、验证、格式化和只读功能。</p>
            </div>

            <div class="main-content">
                <!-- 基础编辑器示例 -->
                <div class="section">
                    <h2>
                        <i class="el-icon-edit"></i>
                        基础编辑器
                    </h2>
                    <div class="editor-container">
                        <JsonEditor
                            ref="basicEditor"
                            v-model="basicData"
                            :options="basicConfig"
                            @change="onBasicChange"
                            @error="onError"
                        />
                    </div>
                    <div class="actions">
                        <el-button @click="formatBasic">格式化</el-button>
                        <el-button @click="validateBasic">验证</el-button>
                        <el-button @click="resetBasic">重置</el-button>
                    </div>
                </div>

                <!-- 高级编辑器示例 -->
                <div class="section">
                    <h2>
                        <i class="el-icon-setting"></i>
                        高级编辑器 (带只读字段)
                    </h2>
                    <div class="editor-container">
                        <JsonEditor
                            ref="advancedEditor"
                            v-model="advancedData"
                            :options="advancedConfig"
                            @change="onAdvancedChange"
                            @error="onError"
                        />
                    </div>
                    <div class="actions">
                        <el-button @click="testReadonlyChanges">测试只读字段检测</el-button>
                        <el-button @click="testUtilityFunctions">测试工具函数</el-button>
                        <el-button @click="addNewField">添加新字段</el-button>
                    </div>
                </div>

                <!-- 控制面板 -->
                <div class="section">
                    <h2>
                        <i class="el-icon-monitor"></i>
                        控制面板
                    </h2>
                    <div class="control-panel">
                        <div class="option-group">
                            <h3>基础选项</h3>
                            <el-checkbox v-model="basicConfig.readonly">只读模式</el-checkbox>
                            <el-checkbox v-model="basicConfig.autoFormat">自动格式化</el-checkbox>
                            <el-checkbox v-model="basicConfig.showFormatButton">显示格式化按钮</el-checkbox>
                        </div>
                        <div class="option-group">
                            <h3>高级选项</h3>
                            <el-checkbox v-model="advancedConfig.strict">严格模式</el-checkbox>
                            <el-checkbox v-model="advancedConfig.visiblePathsExclude">路径排除模式</el-checkbox>
                        </div>
                    </div>
                </div>

                <!-- 日志面板 -->
                <div class="section">
                    <h2>
                        <i class="el-icon-document-copy"></i>
                        操作日志
                    </h2>
                    <div class="log-panel" ref="logPanel">
                        <div v-for="log in logs" :key="log.id" :class="['log-item', log.type]">
                            <span class="log-time">{{ log.time }}</span>
                            <span class="log-type">{{ log.type }}</span>
                            <span class="log-message">{{ log.message }}</span>
                        </div>
                    </div>
                    <div class="actions">
                        <el-button @click="clearLogs">清空日志</el-button>
                        <el-button @click="exportLogs">导出日志</el-button>
                    </div>
                </div>
            </div>
        </div>
    `,

    setup() {
        // 编辑器引用
        const basicEditor = ref(null);
        const advancedEditor = ref(null);
        const logPanel = ref(null);

        // 基础数据和配置
        const basicData = ref({
            name: "JSON Editor Vue3",
            version: "1.0.0",
            features: ["editing", "validation", "formatting", "readonly"],
            config: {
                theme: "light",
                autoSave: true
            }
        });

        const basicConfig = reactive({
            readonly: false,
            theme: 'light',
            height: 300,
            autoFormat: true,
            showFormatButton: true,
            showFullscreenButton: true
        });

        // 高级数据和配置
        const advancedData = ref({
            user: {
                id: "user_123",
                name: "张三",
                email: "zhangsan@example.com",
                profile: {
                    avatar: "https://example.com/avatar.jpg",
                    bio: "前端开发者",
                    preferences: {
                        theme: "dark",
                        language: "zh-CN"
                    }
                }
            },
            system: {
                version: "2.1.0",
                buildTime: "2025-08-08T10:00:00Z",
                features: ["advanced-editing", "path-filtering"]
            },
            data: [
                { id: 1, name: "项目一", status: "active" },
                { id: 2, name: "项目二", status: "inactive" }
            ]
        });

        const advancedConfig = reactive({
            visiblePaths: [],
            visiblePathsExclude: false,
            readonlyPaths: [],
            strict: false
        });

        // 输入字段
        const visiblePathsInput = ref('');
        const readonlyPathsInput = ref('');

        // 日志系统
        const logs = ref([]);
        const lastOperation = ref('初始化完成');
        let logId = 0;

        // 日志函数
        const addLog = (type, message) => {
            const log = {
                id: logId++,
                type,
                message,
                time: new Date().toLocaleTimeString()
            };
            logs.value.push(log);

            // 自动滚动到底部
            nextTick(() => {
                if (logPanel.value) {
                    logPanel.value.scrollTop = logPanel.value.scrollHeight;
                }
            });

            // 限制日志数量
            if (logs.value.length > 200) {
                logs.value.splice(0, 50);
            }
        };

        // 示例数据
        const sampleDataSets = {
            simple: { message: "Hello World", count: 42 },
            complex: {
                metadata: {
                    title: "复杂数据示例",
                    created: new Date().toISOString(),
                    tags: ["demo", "example", "test"]
                },
                content: {
                    sections: [
                        { id: "intro", title: "介绍", content: "这是一个复杂的JSON数据示例" },
                        { id: "features", title: "特性", content: "支持嵌套对象和数组" }
                    ]
                },
                settings: {
                    theme: "auto",
                    language: "zh-CN",
                    notifications: true
                }
            },
            array: [
                { id: 1, name: "Alice", role: "admin" },
                { id: 2, name: "Bob", role: "user" },
                { id: 3, name: "Charlie", role: "moderator" }
            ]
        };

        // 事件处理函数
        const onEditorEvent = (source, eventType, data = null) => {
            let message = `${source} 编辑器触发 ${eventType} 事件`;
            if (data !== null) {
                message += `: ${JSON.stringify(data)}`;
            }
            addLog('info', message);
            lastOperation.value = `${eventType} - ${source}`;
        };

        const onEditorError = (source, error) => {
            const message = error ? `${source} 编辑器错误: ${error}` : `${source} 编辑器错误已清除`;
            addLog(error ? 'error' : 'success', message);
            if (error) {
                lastOperation.value = `错误 - ${source}`;
            }
        };

        // 基础编辑器操作
        const formatBasic = () => {
            if (basicEditor.value) {
                try {
                    basicEditor.value.format();
                    addLog('success', '基础编辑器已格式化');
                } catch (error) {
                    addLog('error', `格式化失败: ${error.message}`);
                }
            }
        };

        const validateBasic = () => {
            if (basicEditor.value) {
                try {
                    const isValid = basicEditor.value.validate();
                    addLog(isValid ? 'success' : 'warning', `基础编辑器验证${isValid ? '通过' : '失败'}`);
                } catch (error) {
                    addLog('error', `验证失败: ${error.message}`);
                }
            }
        };

        const resetBasic = () => {
            basicData.value = {
                name: "JSON Editor Vue3",
                version: "1.0.0",
                features: ["editing", "validation", "formatting", "readonly"],
                config: {
                    theme: "light",
                    autoSave: true
                }
            };
            addLog('info', '基础编辑器已重置');
        };

        // 高级编辑器操作
        const testReadonlyChanges = () => {
            try {
                const testData = { ...advancedData.value };
                testData.system.version = "2.2.0"; // 尝试修改只读字段
                
                const ranges = findReadonlyFieldRanges(JSON.stringify(testData), advancedConfig.readonlyPaths);
                const hasChanges = isReadonlyValueChanged(
                    JSON.stringify(advancedData.value),
                    JSON.stringify(testData),
                    advancedConfig.readonlyPaths
                );
                
                addLog('info', `只读字段检测: 发现${ranges.length}个只读区域, 检测到${hasChanges ? '有' : '无'}变更`);
            } catch (error) {
                addLog('error', `只读字段检测失败: ${error.message}`);
            }
        };

        const testUtilityFunctions = () => {
            try {
                const sourceData = { a: 1, b: { c: 2, d: 3 }, e: [4, 5] };
                const targetData = { a: 10, b: { c: 20 }, f: 6 };
                
                const merged = mergeFieldsSuper(sourceData, targetData, ['b.c', 'f']);
                const picked = pickFieldsSuper(sourceData, ['a', 'b.c']);
                
                addLog('success', `工具函数测试完成: 合并结果包含${Object.keys(merged).length}个字段, 提取结果包含${Object.keys(picked).length}个字段`);
            } catch (error) {
                addLog('error', `工具函数测试失败: ${error.message}`);
            }
        };

        const addNewField = () => {
            const newField = `dynamicField_${Date.now()}`;
            advancedData.value[newField] = {
                type: "dynamic",
                value: Math.floor(Math.random() * 100),
                timestamp: new Date().toISOString()
            };
            addLog('info', `添加新字段: ${newField}`);
        };

        // 事件处理
        const onBasicChange = (value) => {
            addLog('info', '基础编辑器内容已更改');
        };

        const onAdvancedChange = (value) => {
            addLog('info', '高级编辑器内容已更改');
        };

        const onError = (error) => {
            addLog('error', `编辑器错误: ${error}`);
        };

        // 日志操作
        const clearLogs = () => {
            logs.value = [];
            addLog('info', '日志已清空');
        };

        const exportLogs = () => {
            const logData = JSON.stringify(logs.value, null, 2);
            const blob = new Blob([logData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `json-editor-logs-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            addLog('success', '日志已导出');
        };

        // 编辑器方法调用
        const callEditorMethod = async (editorType, method, ...args) => {
            try {
                const editor = editorType === 'basic' ? basicEditor.value : advancedEditor.value;
                if (!editor) {
                    addLog('error', `${editorType} 编辑器不可用`);
                    return;
                }

                const result = await editor[method](...args);
                addLog('success', `调用 ${editorType}.${method}() 成功`);
                if (result !== undefined) {
                    addLog('info', `返回值: ${JSON.stringify(result)}`);
                }
                lastOperation.value = `${method} - ${editorType}`;
                return result;
            } catch (error) {
                addLog('error', `调用 ${editorType}.${method}() 失败: ${error.message}`);
                lastOperation.value = `错误: ${method} - ${editorType}`;
            }
        };

        const getEditorValue = (editorType) => {
            const editor = editorType === 'basic' ? basicEditor.value : advancedEditor.value;
            if (editor) {
                const value = editor.getValue();
                addLog('info', `${editorType} 编辑器当前值: ${JSON.stringify(value)}`);
                return value;
            }
        };

        const setRandomValue = (editorType) => {
            const editor = editorType === 'basic' ? basicEditor.value : advancedEditor.value;
            const randomData = {
                timestamp: Date.now(),
                random: Math.random(),
                data: Object.keys(sampleDataSets)[Math.floor(Math.random() * 3)]
            };

            if (editor) {
                editor.setValue(randomData);
                addLog('success', `${editorType} 编辑器设置随机值`);
            }
        };

        // 示例数据加载
        const loadSampleData = () => {
            const keys = Object.keys(sampleDataSets);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            basicData.value = sampleDataSets[randomKey];
            addLog('success', `加载示例数据: ${randomKey}`);
            lastOperation.value = `加载示例数据: ${randomKey}`;
        };

        const loadComplexData = () => {
            advancedData.value = sampleDataSets.complex;
            addLog('success', '加载复杂数据到高级编辑器');
            lastOperation.value = '加载复杂数据';
        };

        // 路径配置
        const applyVisiblePaths = () => {
            if (visiblePathsInput.value.trim()) {
                advancedConfig.visiblePaths = visiblePathsInput.value.split(',').map(p => p.trim());
                addLog('info', `应用可见路径: ${advancedConfig.visiblePaths.join(', ')}`);
            } else {
                advancedConfig.visiblePaths = [];
                addLog('info', '清除可见路径过滤');
            }
            lastOperation.value = '应用可见路径';
        };

        const applyReadonlyPaths = () => {
            if (readonlyPathsInput.value.trim()) {
                advancedConfig.readonlyPaths = readonlyPathsInput.value.split(',').map(p => p.trim());
                addLog('info', `应用只读路径: ${advancedConfig.readonlyPaths.join(', ')}`);
            } else {
                advancedConfig.readonlyPaths = [];
                addLog('info', '清除只读路径');
            }
            lastOperation.value = '应用只读路径';
        };

        // 测试功能
        const testVisiblePaths = () => {
            visiblePathsInput.value = 'user.name,user.profile.bio,system.version';
            applyVisiblePaths();
            addLog('success', '测试可见路径过滤');
        };

        const testReadonlyPaths = () => {
            readonlyPathsInput.value = 'user.id,system.version,system.buildTime';
            applyReadonlyPaths();
            addLog('success', '测试只读路径设置');
        };

        // 工具函数测试
        const testPickFields = () => {
            try {
                const testData = sampleDataSets.complex;
                const paths = ['metadata.title', 'content.sections', 'settings.theme'];
                const result = pickFieldsSuper(testData, paths, false);
                addLog('success', 'pickFieldsSuper 测试成功');
                addLog('info', `结果: ${JSON.stringify(result, null, 2)}`);
                lastOperation.value = 'pickFieldsSuper 测试';
            } catch (error) {
                addLog('error', `pickFieldsSuper 测试失败: ${error.message}`);
            }
        };

        const testMergeFields = () => {
            try {
                const source = { a: 1, b: { c: 2 } };
                const target = { b: { d: 3 }, e: 4 };
                const paths = ['b.c', 'e'];
                const result = mergeFieldsSuper(source, target, paths, true);
                addLog('success', 'mergeFieldsSuper 测试成功');
                addLog('info', `结果: ${JSON.stringify(result, null, 2)}`);
                lastOperation.value = 'mergeFieldsSuper 测试';
            } catch (error) {
                addLog('error', `mergeFieldsSuper 测试失败: ${error.message}`);
            }
        };

        const testReadonlyRanges = () => {
            try {
                const jsonText = JSON.stringify(advancedData.value, null, 2);
                const paths = ['user.id', 'system.version'];
                const ranges = findReadonlyFieldRanges(jsonText, paths);
                addLog('success', 'findReadonlyFieldRanges 测试成功');
                addLog('info', `找到 ${ranges.length} 个只读范围`);
                lastOperation.value = 'findReadonlyFieldRanges 测试';
            } catch (error) {
                addLog('error', `findReadonlyFieldRanges 测试失败: ${error.message}`);
            }
        };

        const testReadonlyValidation = () => {
            try {
                const original = JSON.stringify(advancedData.value, null, 2);
                const modified = original.replace('"user_123"', '"modified_id"');
                const paths = ['user.id'];
                const isChanged = isReadonlyValueChanged(original, modified, paths);
                addLog('success', 'isReadonlyValueChanged 测试成功');
                addLog('info', `只读字段是否被修改: ${isChanged}`);
                lastOperation.value = 'isReadonlyValueChanged 测试';
            } catch (error) {
                addLog('error', `isReadonlyValueChanged 测试失败: ${error.message}`);
            }
        };

        const mergeFields = () => {
            try {
                const newData = {
                    user: { name: "修改后的名字" },
                    newField: "新增字段"
                };
                const merged = mergeFieldsSuper(newData, advancedData.value, ['user.name'], true);
                advancedData.value = merged;
                addLog('success', '字段合并测试完成');
                lastOperation.value = '字段合并测试';
            } catch (error) {
                addLog('error', `字段合并失败: ${error.message}`);
            }
        };

        // 重置功能
        const resetBasicDemo = () => {
            basicData.value = {
                name: "JSON Editor Vue3",
                version: "1.0.0",
                features: ["editing", "validation", "formatting"]
            };
            addLog('info', '重置基础演示');
            lastOperation.value = '重置基础演示';
        };

        const resetAdvancedDemo = () => {
            advancedData.value = sampleDataSets.complex;
            advancedConfig.visiblePaths = [];
            advancedConfig.readonlyPaths = [];
            visiblePathsInput.value = '';
            readonlyPathsInput.value = '';
            addLog('info', '重置高级演示');
            lastOperation.value = '重置高级演示';
        };

        // 初始化
        onMounted(() => {
            addLog('success', 'JSON Editor Vue3 真实组件示例初始化完成');
            addLog('info', '所有功能基于真实的 JsonEditor.vue 组件');
        });

        return {
            // 编辑器引用
            basicEditor,
            advancedEditor,
            logPanel,

            // 数据
            basicData,
            basicConfig,
            advancedData,
            advancedConfig,

            // 输入
            visiblePathsInput,
            readonlyPathsInput,

            // 状态
            logs,
            lastOperation,

            // 方法
            formatBasic,
            validateBasic,
            resetBasic,
            testReadonlyChanges,
            testUtilityFunctions,
            addNewField,
            onBasicChange,
            onAdvancedChange,
            onError,
            clearLogs,
            exportLogs,
            onEditorEvent,
            onEditorError,
            callEditorMethod,
            getEditorValue,
            setRandomValue,
            loadSampleData,
            loadComplexData,
            applyVisiblePaths,
            applyReadonlyPaths,
            testVisiblePaths,
            testReadonlyPaths,
            testPickFields,
            testMergeFields,
            testReadonlyRanges,
            testReadonlyValidation,
            mergeFields,
            resetBasicDemo,
            resetAdvancedDemo
        };
    }
};

// 创建Vue应用
const app = createApp(App);

// 配置Element Plus
app.use(ElementPlus);
app.mount('#app');
