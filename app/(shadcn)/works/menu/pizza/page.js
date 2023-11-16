

const pizzas = [
    { size: 'Large', price: 23.99 },
    { size: 'Medium', price: 20.99 },
    { size: 'Small', price: 16.99 },
    { size: 'Personal', price: 8.99 },
]

const sides = [
    { size: '7', price: 6.99 },
    { size: '7+7', price: 6.99 * 2 },
    { size: '14', price: 12.99 },
    { size: '7+14', price: 12.99 + 6.99 },
]

const dips = [
    { size: 'one', price: 0.59 },
]

const discounts = [
    { minSpend: 35, pizzaDiscount: 0.5, otherDiscount: 1 },
    { minSpend: 40, pizzaDiscount: 0.6, otherDiscount: 0.6 },
    { minSpend: 20, pizzaDiscount: 0.75, otherDiscount: 0.75 },
];

let combos = [];


// Generate all possible combos
for (let discount of discounts) {
    for (let pizza of pizzas) {
        for (let side of sides) {
            for (let dipCount = 0; dipCount <= 2; dipCount++) {
                const totalPizzaPrice = pizza.price;
                const totalSidePrice = side.price + dipCount * dips[0].price;
                const totalPrice = totalPizzaPrice + totalSidePrice;
                if (totalPrice > discount.minSpend) {
                    let seperatedSides = [];
                    if (side.size == '7+14') {
                        seperatedSides = [
                            { type: 'side', ...sides[0] },
                            { type: 'side', ...sides[2] },
                        ];
                    } else if (side.size == '7+7') {
                        seperatedSides = [
                            { type: 'side', ...sides[0] },
                            { type: 'side', ...sides[0] },
                        ];
                    } else {
                        seperatedSides = [
                            { type: 'side', ...side },
                        ];
                    }
                    combos.push(
                        {
                            items: [
                                { type: 'pizza', ...pizza },
                                ...seperatedSides,
                                ...new Array(dipCount).fill().map(() => ({ ...{ type: 'dip', ...dips[0] } }))
                            ],
                            totalPizzaPrice,
                            totalSidePrice,
                            totalPrice,
                            discount
                        })
                }
            }
        }
    }
}

// Sort combo from least to most total final pay amount
combos.sort((a, b) => a.totalPrice - b.totalPrice);
// console.log(combos);

for (let combo of combos) {
    combo.items = combo.items.map(
        (item) => {
            return {
                ...item,
                discountedPrice: item.type == 'pizza' ? (
                    item.price * combo.discount.pizzaDiscount
                ) : (
                    item.price * combo.discount.otherDiscount
                )
            }
        }
    );
    combo.finalPay = combo.totalPizzaPrice * combo.discount.pizzaDiscount + combo.totalSidePrice * combo.discount.otherDiscount;
    combo.uuid = crypto.randomUUID();
}

combos.sort((a, b) => a.finalPay - b.finalPay);

function Item({ item }) {
    const width = item.price * 24;
    const style = { width: `${width}px` };

    const itemClasses = {
        pizza: 'bg-red-600',
        side: 'bg-blue-600',
        dip: 'bg-green-600'
    };

    return (
        <div
            className={`inline-block h-6 ${itemClasses[item.type]} text-center text-white mr-0.5 mb-1`}
            style={style}
        >
            {item.type == 'dip' ? '' : `${item.type} ${item.size}`}
        </div>
    );
}

function Combo({ combo }) {
    return (
        <div key={combo.uuid} className="mb-4">
            <div className="flex">
                {combo.items.map((item, index) => (
                    <Item key={index} item={{ ...item, price: item.discountedPrice }} />
                ))}
                <div className="ml-auto">
                    discounted: £{combo.finalPay.toFixed(2)}
                </div>
            </div>
            <div className="flex opacity-50">
                {combo.items.map((item, index) => (
                    <Item key={index} item={item} />
                ))}
                <div className="ml-auto">
                    £{combo.totalPrice.toFixed(2)}
                </div>
            </div>
            <div className="w-full text-right font-bold opacity-20">minimum spend £{combo.discount.minSpend}, pizza {100-100*combo.discount.pizzaDiscount}% off, side {100-100*combo.discount.otherDiscount}% off </div>
            
        </div>);
}

function Combos({ combos }) {
    return (
        <div className="w-full max-w-6xl mx-auto pb-10 px-4">
            {combos.map((combo) => (
                <Combo key={combo.uuid} combo={combo} />
            ))}
        </div>
    );
}


export default function Page() {

    return (
        <div className="w-full max-w-6xl mx-auto pb-10 px-4">
            <Combos combos={combos} />
        </div>
    );
}