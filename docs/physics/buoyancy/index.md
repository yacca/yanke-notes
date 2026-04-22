<script setup>
import BuoyancyLab from './BuoyancyLab.vue'
</script>

# 浮力

## 阿基米德原理

::: tip 阿基米德原理内容
浮力大小 = 排开液体的重力
:::

::: formula
$F_浮=G_排=m_排g=\rho _液gV_排$
:::

## 浮沉条件

| 浮沉状态 |  受力关系  |     密度关系      |         状态         |
| :------- | :--------: | :---------------: | :------------------: |
| 上浮     | $F_{浮}>G$ | $\rho_液>\rho_物$ |      非受力平衡      |
| 下沉     |  $F_浮<G$  | $\rho_液<\rho_物$ |      非受力平衡      |
| 悬浮     |  $F_浮=G$  | $\rho_液=\rho_物$ | 可停在液面下任何位置 |
| 漂浮     |  $F_浮=G$  | $\rho_液>\rho_物$ |   “上浮”的最终状态   |
| 沉底     |  $F_浮<G$  | $\rho_液<\rho_物$ |   “下沉”的最终状态   |

## 来自 PhET 的在线仿真实验

[浮力](./phet-buoyancy)

访问 [PhET 网站](https://phet.colorado.edu/) 查看所有在线仿真实验

## 在线实验

在本实验中，你可以通过调节滑块来改变物块的**高度坐标 ($Y$)**。观察当物块接触水面、部分浸入、以及完全浸入液体时，弹簧测力计读数 ($F$) 的实时变化。

::: tip 实验观察提示
注意观察当物块底部 ($Y_{bottom}$) 穿过 $Liquid Surface$ 时，读数 $F$ 才开始减小。
:::

<BuoyancyLab />

## 实验原理

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
