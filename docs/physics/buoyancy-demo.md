# 浮力与排开液体体积的关系演示

在本实验中，你可以通过调节滑块来改变物块的**高度坐标 ($Y$)**。观察当物块接触水面、部分浸入、以及完全浸入液体时，弹簧测力计读数 ($F$) 的实时变化。

<script setup>
import BuoyancyLab from './components/BuoyancyLab.vue'
</script>

::: tip 实验观察提示
注意观察当物块底部 ($Y_{bottom}$) 穿过 $Liquid Surface$ 时，读数 $F$ 才开始减小。
:::

<BuoyancyLab />

### 实验原理

根据阿基米德原理：$F_{buy} = \rho \cdot g \cdot V_{dis}$

我们通过读数变化来感知浮力：$F = G_{obj} - F_{buy}$

$$
F =
\begin{cases}
G_{obj} & \text{if } Y_{bottom} \le \text{WaterLevel} \text{ (不浸入)} \\
G_{obj} - k \cdot (Y_{bottom} - \text{WaterLevel}) & \text{if 部分浸入} \\
G_{obj} - k \cdot H_{obj} & \text{if } Y_{top} \ge \text{WaterLevel} \text{ (完全浸入)}
\end{cases}
$$
