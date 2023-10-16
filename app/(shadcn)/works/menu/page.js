'use client';
// const data = {
//     "menu": [
//         {
//             "category": "A La Carte",
//             "sections": [
//                 {
//                     "title": "FOR THE TABLE",
//                     "items": [
//                         {
//                             "title": "SOURDOUGH BREAD v",
//                             "description": "Cadiz sourdough and smoked paprika butter.",
//                             "price": "4"
//                         },
//                         {
//                             "title": "GORDAL OLIVES vg",
//                             "description": "Chilli scented Gordal olives.",
//                             "price": "5"
//                         },
//                         {
//                             "title": "CRISPY WHITEBAIT",
//                             "description": "Smoked paprika dusted, alioli and lemon.",
//                             "price": "5"
//                         },
//                         {
//                             "title": "PADRÓN PEPPERS v",
//                             "description": "Sautéed in olive oil and Maldon sea salt.",
//                             "price": "6"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "CUMBRAE OYSTERS",
//                     "description": "Cumbrae Oysters. Choose 3 or 6, served on ice",
//                     "items": [
//                         {
//                             "title": "SHALLOTS, SHERRY VINEGAR & LEMON",
//                             "description": "",
//                             "price": "10 / 18"
//                         },
//                         {
//                             "title": "SOY, PICKLED GINGER, CHILLI & CORIANDER",
//                             "description": "",
//                             "price": "10 / 18"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "IBÉRICO PLATTERS",
//                     "description": "Iberico ham platters to share",
//                     "items": [
//                         {
//                             "title": "CARVED IBÉRICO HAM",
//                             "description": "Cebo de Campo Ibérico ham",
//                             "price": "19"
//                         },
//                         {
//                             "title": "IBÉRICO HAM & MANCHEGO",
//                             "description": "Cebo de Campo Ibérico ham & aged Manchego cheese",
//                             "price": "24"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "GRILL",
//                     "items": [
//                         {
//                             "title": "9OZ PRIME RIB EYE STEAK",
//                             "description": "Richly-marbled prime cut, cooked with confit garlic & rosemary paste, served with seared Padrón pepper and skinny fries.",
//                             "price": "29"
//                         },
//                         {
//                             "title": "CHOOSE YOUR STEAK SAUCE",
//                             "description": "- Green peppercorn\n- Béarnaise sauce",
//                             "price": "3"
//                         },
//                         {
//                             "title": "ADD TO YOUR STEAK:",
//                             "price": ""
//                         },
//                         {
//                             "title": "+ HALF SCOTTISH LOBSTER WITH GARLIC BUTTER",
//                             "description": "",
//                             "price": "32"
//                         },
//                         {
//                             "title": "+ 2 KING PRAWNS WITH GARLIC BUTTER",
//                             "description": "",
//                             "price": "6"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SMALL PLATES",
//                     "items": [
//                         {
//                             "title": "SEAFOOD BISQUE",
//                             "description": "Rich fish & shellfish soup, croutons & alioli.",
//                             "price": "8"
//                         },
//                         {
//                             "title": "SPICED KING PRAWNS",
//                             "description": "Butterflied & spiced shell-on king prawns, garlic, lemon & parsley butter sauce.",
//                             "price": "13"
//                         },
//                         {
//                             "title": "CHORIZO CROQUETTES",
//                             "description": "Crisp-crumbed chorizo & manchego cheese croquettes with Romesco sauce.",
//                             "price": "8"
//                         },
//                         {
//                             "title": "SUMMER CHICKEN SALAD",
//                             "description": "Marinated & grilled chicken, baby gem lettuce, radish, caramelised onions, crispy potatoes, sourdough croutons, pine nuts and ginger mayo dressing. Served as a starter or main.",
//                             "price": "8 / 17"
//                         },
//                         {
//                             "title": "PULPO GALLEGO",
//                             "description": "Grilled octopus, new potatoes, chick peas, smoked paprika, red onion, parsley, lemon and olive oil.",
//                             "price": "11"
//                         },
//                         {
//                             "title": "GRILLED ASPARAGUS v",
//                             "description": "Poached egg, large crouton and hollandaise sauce.",
//                             "price": "8"
//                         },
//                         {
//                             "title": "SEARED SCOTTISH SCALLOPS",
//                             "description": "Spanish morcilla and Bramley apple purée.",
//                             "price": "15"
//                         },
//                         {
//                             "title": "CALAMARI",
//                             "description": "Crisp-fried, sea salt, chilli and smoked paprika alioli.",
//                             "price": "11"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SHETLAND MUSSELS",
//                     "description": "Served as a starter with sourdough bread or skinny fries as a main",
//                     "items": [
//                         {
//                             "title": "WINE, SHALLOTS, PARSLEY & CREAM",
//                             "description": "",
//                             "price": "9 / 15"
//                         },
//                         {
//                             "title": "WINE, CHORIZO, CHILLI, GARLIC, SAFFRON & TOMATO",
//                             "description": "",
//                             "price": "10 / 16"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SCOTTISH LOBSTER",
//                     "description": "Half or whole with skinny fries or Cadiz house salad",
//                     "items": [
//                         {
//                             "title": "GRILLED LOBSTER",
//                             "description": "With garlic butter.",
//                             "price": "32 / 60"
//                         },
//                         {
//                             "title": "LOBSTER THERMIDOR",
//                             "description": "Grilled lobster, shallot, brandy, Manchego cheese, tabasco and smoked paprika sauce.",
//                             "price": "32 / 60"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "LARGE PLATES",
//                     "items": [
//                         {
//                             "title": "KING SCALLOPS",
//                             "description": "Seared Scottish king scallops with a rich cream, white wine & coral sauce, fondant potato, baby spinach, pine nuts & Spanish morcilla crumb.",
//                             "price": "28"
//                         },
//                         {
//                             "title": "SEAFOOD ARROZ",
//                             "description": "King prawns, Shetland mussels & calamari, saffron Arborio rice & large grilled shell-on king prawn.",
//                             "price": "20"
//                         },
//                         {
//                             "title": "NORTH ATLANTIC COD",
//                             "description": "Roasted North Atlantic cod wrapped in Serrano ham, fondant potato, samphire & rich vermouth velouté, crispy rocket & basil oil",
//                             "price": "21"
//                         },
//                         {
//                             "title": "LEMON SOLE",
//                             "description": "Whole baked lemon sole & skinny fries, with your choice of butter. Choose from:",
//                             "price": "29",
//                             "options": [
//                                 "CAPERS & PARSLEY",
//                                 "LEMON, ALMONDS & CAPERS",
//                                 "CHILLI, LIME & HERB"
//                             ]
//                         },
//                         {
//                             "title": "GRILLED HALIBUT",
//                             "description": "Grilled fillet of halibut, marinated in fennel & mustard, served with fondant potato and saffron-garden pea sauce.",
//                             "price": "28"
//                         },
//                         {
//                             "title": "HADDOCK & CHIPS",
//                             "description": "Beer battered haddock, hand cut chips & mint pea purée.",
//                             "price": "16"
//                         },
//                         {
//                             "title": "VEGETABLE ARROZ v",
//                             "description": "Red peppers, asparagus, woodland mushrooms, garlic, white wine & smoked paprika arborio rice.",
//                             "price": "14"
//                         },
//                         {
//                             "title": "CHICKEN & MORCILLA",
//                             "description": "Roasted chicken breast with Spanish morcilla, sautéed woodland mushrooms, fondant potato and rich red wine & port jus",
//                             "price": "18"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SHELLFISH",
//                     "items": [
//                         {
//                             "title": "HOT SEAFOOD PLATTER FOR TWO",
//                             "description": "Shetland mussels with wine, shallots & cream, whole lobster Thermidor, 2 large shell-on grilled king prawns, 2 grilled Scottish king scallops, Shetland mussels with wine, chilli & chorizo, smoked paprika alioli & skinny fries.",
//                             "price": "95"
//                         },
//                         {
//                             "title": "+ ADD 6 CUMBRAE OYSTERS",
//                             "description": "With shallots, sherry vinegar & lemon or soy, pickled ginger, chilli & coriander.",
//                             "price": "18"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SIDES",
//                     "items": [
//                         {
//                             "title": "HAND CUT CHIPS, TRUFFLE OIL & MANCHEGO CHEESE",
//                             "description": "",
//                             "price": "4.5"
//                         },
//                         {
//                             "title": "SKINNY FRIES",
//                             "description": "",
//                             "price": "4"
//                         },
//                         {
//                             "title": "HAND CUT CHIPS",
//                             "description": "",
//                             "price": "4"
//                         },
//                         {
//                             "title": "SEASONAL NEW POTATOES",
//                             "description": "",
//                             "price": "4"
//                         },
//                         {
//                             "title": "BUTTERED GREENS",
//                             "description": "",
//                             "price": "4.5"
//                         },
//                         {
//                             "title": "CADIZ HOUSE SALAD",
//                             "description": "",
//                             "price": "4"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "PAELLA SUNDAYS",
//                     "description": "Available all day, on Sundays only.\nThere are three delicious combinations to choose from, all made with premium Calasparra rice, serving 2-3 people.",
//                     "items": [
//                         {
//                             "title": "CADIZ PAELLA",
//                             "description": "Seasonal white fish, king prawns, calamari, Shetland mussels, chicken and pork loin, topped with four grilled extra-large shell-on king prawns and Padrón pepper.",
//                             "price": "32"
//                         },
//                         {
//                             "title": "CHICKEN & PORK PAELLA",
//                             "description": "Chicken, pork loin, woodland mushrooms, onion and fresh asparagus.",
//                             "price": "27"
//                         },
//                         {
//                             "title": "SEAFOOD PAELLA",
//                             "description": "Seasonal white fish, king prawns, calamari and Shetland mussels topped with four grilled extra large shell-on king prawns.",
//                             "price": "39"
//                         },
//                         {
//                             "title": "ADD TO YOUR PAELLA:",
//                             "price": ""
//                         },
//                         {
//                             "title": "+ WHOLE GRILLED LOBSTER",
//                             "price": "60"
//                         },
//                         {
//                             "title": "+ FOUR LARGE GRILLED KING PRAWNS",
//                             "price": "12"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "category": "Lunch &\nPre-Theatre",
//             "sections": [
//                 {
//                     "title": "menú del dia",
//                     "description": "2 Courses for 21.95 · 3 Courses for 25.95. Available Monday - Friday 12-5pm & Saturday 12-4pm.\nAvailability will show when booking. \nNot available in August.",
//                     "items": []
//                 },
//                 {
//                     "title": "Starters",
//                     "items": [
//                         {
//                             "title": "SEAFOOD BISQUE",
//                             "description": "Rich fish & shellfish soup, croutons and alioli."
//                         },
//                         {
//                             "title": "CHORIZO CROQUETTES",
//                             "description": "Crisp-crumbed chorizo & manchego cheese croquettes with Romesco sauce."
//                         },
//                         {
//                             "title": "PINK PEPPERCORN PRAWNS",
//                             "description": "Fried king prawns marinated with pink peppercorns, lime & coriander with lime mayo."
//                         },
//                         {
//                             "title": "SHETLAND MUSSELS",
//                             "description": "Steamed with white wine, shallots, parsley & cream with sourdough bread"
//                         },
//                         {
//                             "title": "HONEYED GOATS ' CHEESE V",
//                             "description": "Whipped goats' cheese, sourdough bread and beetroot coulis"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "Large Plates",
//                     "items": [
//                         {
//                             "title": "BEER BATTERED HADDOCK",
//                             "description": "Hand cut chips and mint pea purée."
//                         },
//                         {
//                             "title": "NORTH ATLANTIC COD",
//                             "description": "Cod wrapped in Serrano ham, fondant potato, baby spinach, rich vermouth velouté, crispy rocket and basil oil."
//                         },
//                         {
//                             "title": "CHICKEN & MORCILLA",
//                             "description": "Roasted chicken breast, Spanish morcilla, sautéed woodland mushrooms, fondant potato and rich red wine & port jus"
//                         },
//                         {
//                             "title": "SHETLAND MUSSELS",
//                             "description": "Steamed with white wine, shallots, parsley and cream with skinny fries."
//                         },
//                         {
//                             "title": "VEGETABLE ARROZ",
//                             "description": "Red peppers, asparagus, woodland mushrooms, garlic, white wine & smoked paprika arborio rice."
//                         },
//                         {
//                             "title": "PRIME RIB EYE STEAK",
//                             "description": "9oz Richly-marbled prime cut, cooked with confit garlic & rosemary paste, served with seared Padrón pepper & skinny fries.",
//                             "price": "+10"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "Desserts",
//                     "items": [
//                         {
//                             "title": "SALTED CARAMEL CHEESECAKE V",
//                             "description": "White chocolate & salted caramel cheesecake, salted caramel sauce and chocolate tuile."
//                         },
//                         {
//                             "title": "CHOCOLATE FONDANT V",
//                             "description": "Rich chocolate & praline fondant, biscuit crumb, chocolate sauce and vanilla ice cream."
//                         },
//                         {
//                             "title": "PANNA COTTA",
//                             "description": "White chocolate & buttermilk panna cotta, apple, mint & passion fruit compote"
//                         }
//                     ]
//                 },
//                 {
//                     "title": "SIDES",
//                     "items": [
//                         {
//                             "title": "Hand cut chips with truffle oil & Manchego",
//                             "price": "4.5"
//                         },
//                         {
//                             "title": "Skinny fries",
//                             "price": "4"
//                         },
//                         {
//                             "title": "Hand cut chips",
//                             "price": "4"
//                         },
//                         {
//                             "title": "Seasonal new potatoes",
//                             "price": "4"
//                         },
//                         {
//                             "title": "Buttered greens",
//                             "price": "4.5"
//                         },
//                         {
//                             "title": "Cadiz house salad",
//                             "price": "4"
//                         },
//                         {
//                             "title": "Gordal Olives",
//                             "price": "5"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "category": "Desserts",
//             "sections": [
//                 {
//                     "title": "Desserts",
//                     "items": [
//                         {
//                             "title": "CHOCOLATE FONDANT V",
//                             "description": "Rich chocolate & praline fondant, biscuit crumb, chocolate sauce and vanilla ice cream",
//                             "price": "6.95"
//                         },
//                         {
//                             "title": "SALTED CARAMEL CHEESECAKE V",
//                             "description": "White chocolate & salted caramel cheesecake, salted caramel sauce and chocolate tuile",
//                             "price": "6.45"
//                         },
//                         {
//                             "title": "RASPBERRY PAVLOVA V",
//                             "description": "Fresh raspberries, mascarpone cream and raspberry gel",
//                             "price": "6.95"
//                         },
//                         {
//                             "title": "PANNA COTTA",
//                             "description": "White chocolate & buttermilk panna cotta, apple, mint & passion fruit compote",
//                             "price": "6.45"
//                         },
//                         {
//                             "title": "CADIZ CHEESE SELECTION",
//                             "description": "Munster, Picos Blue, Tetilla Prestes & Manchego, fig & almond wheel, onion & sultana chutney with Scottish oatcakes",
//                             "price": "8.95"
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// };

const data = {
    "menu": [
        {
            "category": "A La Carte",
            "sections": [
                {
                    "title": "To Start, For us all",
                    "items": [
                        {
                            "title": "Dorset Sourdough Symphony",
                            "description": "Home baked sourdough from Dorset's finest grains served with our signature smoked paprika butter.",
                            "price": "4"
                        },
                        {
                            "title": "Dorset Coastline Platter",
                            "description": "A delightful selection of locally sourced seafood, including smoked mackerel pâté, Lyme Bay crab cakes, and seared scallops with garlic butter.",
                            "price": "12"
                        },
                        {
                            "title": "Smoked Haddock Croquettes",
                            "description": "Crispy croquettes filled with smoked haddock and fresh herbs, served with a tangy lemon mayo.",
                            "price": "7"
                        },
                        {
                            "title": "Crispy Whitebait",
                            "description": "Freshly caught small fish dipped in a light batter, deep-fried until golden. Served with lemon aioli.",
                            "price": "8"
                        }
                    ]
                },
                {
                    "title": "From the Dorset Waters",
                    "description": "Fresh catches from the Dorset coast, prepared to perfection.",
                    "items": [
                        {
                            "title": "Pan-Seared Turbot",
                            "description": "Locally caught turbot fillet, pan-seared to achieve a crispy skin, served with creamy mash and a zesty lemon caper sauce.",
                            "price": "26"
                        },
                        {
                            "title": "Dill-Marinated Lyme Bay Cod",
                            "description": "Flaky cod fillet marinated in fresh dill, accompanied by new potatoes, wilted spinach, and a buttery white wine sauce.",
                            "price": "22"
                        },
                        {
                            "title": "Chargrilled Portland Lobster",
                            "description": "Whole lobster from the shores of Portland, expertly grilled and served with garlic butter, crispy fries, and a fresh garden salad.",
                            "price": "38"
                        },
                        {
                            "title": "Crispy Dorset Scampi",
                            "description": "Golden-fried scampi made with locally sourced langoustines, served with hand-cut chips and tartare sauce.",
                            "price": "18"
                        }
                    ]
                },
                {
                    "title": "Vegetarian Delights",
                    "description": "Flavorsome vegetarian dishes inspired by the abundance of Dorset's produce.",
                    "items": [
                        {
                            "title": "Wild Mushroom Risotto",
                            "description": "Creamy Arborio rice cooked with a medley of wild mushrooms, finished with truffle oil and shaved Parmesan.",
                            "price": "19"
                        },
                        {
                            "title": "Pan-Fried Halloumi Stack",
                            "description": "Layers of grilled halloumi, roasted Mediterranean vegetables, and basil pesto, accompanied by a vibrant rocket salad.",
                            "price": "16"
                        },
                        {
                            "title": "Beetroot and Goat Cheese Tart",
                            "description": "Savoury tart filled with roasted beetroot and creamy goat cheese, served with a side of mixed greens.",
                            "price": "14"
                        },
                        {
                            "title": "Sweet Potato and Spinach Curry",
                            "description": "A fragrant curry made with locally sourced sweet potatoes, fresh spinach, and aromatic spices. Served with basmati rice and naan bread.",
                            "price": "17"
                        }
                    ]
                },
                {
                    "title": "Indulge in Tempting Extras",
                    "description": "Enhance your dining experience with these delightful extras.",
                    "items": [
                        {
                            "title": "Grilled King Prawns",
                            "description": "Juicy king prawns grilled to perfection, served with a zesty lemon and garlic butter.",
                            "price": "9"
                        },
                        {
                            "title": "Seared Scallops with Black Pudding",
                            "description": "Scallops cooked to golden perfection, served with a slice of crispy black pudding and celeriac remoulade.",
                            "price": "12"
                        },
                        {
                            "title": "Crispy Calamari Rings",
                            "description": "Tender calamari rings coated in a light, crispy batter, served with aioli and a fresh lemon wedge.",
                            "price": "10"
                        },
                        {
                            "title": "Truffle-infused Hand Cut Chips",
                            "description": "Thick-cut potato fries drizzled with luxurious truffle oil and sprinkled with grated Manchego cheese.",
                            "price": "6"
                        }
                    ]
                },
                {
                    "title": "Sides",
                    "items": [
                        {
                            "title": "Seasonal Grilled Vegetables",
                            "description": "Freshly grilled seasonal vegetables, lightly seasoned with olive oil and herbs.",
                            "price": "5"
                        },
                        {
                            "title": "Buttered New Potatoes",
                            "description": "Baby new potatoes tossed in melted butter and sprinkled with sea salt.",
                            "price": "4"
                        },
                        {
                            "title": "Mixed Green Salad",
                            "description": "A refreshing blend of mixed greens, cherry tomatoes, and cucumber, dressed with a light vinaigrette.",
                            "price": "4"
                        }
                    ]
                }
            ]
        },
        {
            "category": "Lunch & Pre-Theatre",
            "sections": [
                {
                    "title": "For the Love of Seafood: Set Menu",
                    "description": "Indulge in a multi-course set menu specially curated for your lunch and pre-theatre cravings. Available Monday - Friday from 12-3pm & 5-7pm. Enjoy 2 Courses for £21.95 or 3 Courses for £25.95.",
                    "items": []
                },
                {
                    "title": "Dorset Coastal Bites",
                    "items": [
                        {
                            "title": "Dorset Crab Salad",
                            "description": "Local crab meat served on a bed of fresh mixed greens, with a tangy citrus dressing."
                        },
                        {
                            "title": "Smoked Mackerel Pâté",
                            "description": "Creamy smoked mackerel pâté, served with warm toasted sourdough and pickled shallots."
                        },
                        {
                            "title": "Lyme Bay Fish Soup",
                            "description": "Rich fish soup made with locally sourced catch, accompanied by crusty bread."
                        }
                    ]
                },
                {
                    "title": "Main Event",
                    "items": [
                        {
                            "title": "Grilled Whole Plaice",
                            "description": "Fresh whole plaice, grilled and served with a zesty lemon and herb dressing."
                        },
                        {
                            "title": "Seafood Linguine",
                            "description": "A medley of Dorset seafood tossed in linguine pasta, with a choice of tomato or white wine sauce."
                        },
                        {
                            "title": "Dorset Fish and Chips",
                            "description": "Beer-battered fillet of locally caught fish, served with hand-cut chips, mushy peas, and tartare sauce."
                        },
                        {
                            "title": "Vegetable Tagine",
                            "description": "Aromatic tagine with seasonal vegetables, chickpeas, and fragrant spices, served with couscous."
                        }
                    ]
                },
                {
                    "title": "Sides",
                    "items": [
                        {
                            "title": "House Wedge Fries",
                            "description": "Thick-cut potato wedges seasoned with a blend of herbs and spices.",
                            "price": ""
                        },
                        {
                            "title": "Crisp Garden Salad",
                            "description": "Crisp lettuce, tomatoes, cucumber, and radishes tossed in a light vinaigrette.",
                            "price": ""
                        }
                    ]
                }
            ]
        },
        {
            "category": "Desserts",
            "sections": [
                {
                    "title": "Sweet Indulgences",
                    "items": [
                        {
                            "title": "Dorset Apple Crumble",
                            "description": "Classic apple crumble made with locally sourced Dorset apples, served with vanilla custard.",
                            "price": "6.95"
                        },
                        {
                            "title": "Sticky Toffee Pudding",
                            "description": "Decadent sticky toffee pudding drizzled with a rich toffee sauce, served with vanilla ice cream.",
                            "price": "6.45"
                        },
                        {
                            "title": "Lemon Posset",
                            "description": "Smooth and creamy lemon posset, topped with a zesty lemon curd and shortbread crumble.",
                            "price": "5.95"
                        },
                        {
                            "title": "Dark Chocolate Mousse",
                            "description": "Indulgent dark chocolate mousse, accompanied by a tangy raspberry compote and almond brittle.",
                            "price": "7.50"
                        },
                        {
                            "title": "Selection of Local Cheeses",
                            "description": "A selection of artisan cheeses from local dairies, served with homemade chutney and crisp crackers.",
                            "price": "8.95"
                        }
                    ]
                }
            ]
        }
    ]
};


import { useState } from 'react';

const Item = ({ item }) => {
    return (
        <div className="flex flex-col my-3">
            <div className="flex justify-between">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{item.title}</h4>
                <span className="text-right scroll-m-20 text-xl font-semibold tracking-tight whitespace-nowrap pl-1">{item.price}</span>
            </div>
            <p className="mb-2 leading-7 [&:not(:first-child)]:mt-2">{item.description}</p>
            {item.options && item.options.map(option => <span key={option} className="text-sm text-gray-500">{option}</span>)}
        </div>
    );
};

const Section = ({ section }) => {
    return (
        <div className="py-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">{section.title}</h3>
            {section.description ? (<p className={`text-center my-2 whitespace-pre-line text-sm text-muted-foreground`}>{section.description}</p>) : null}
            <div className={`mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-24`}>
                {section.items.map(item => <Item item={item} key={item.title} />)}
            </div>
        </div>
    );
};

const Category = ({ category }) => (
    <div className="py-5 rounded-md">
        {category.sections.map(section => <Section section={section} key={section.title} />)}
    </div>
);

export default function Page() {
    const [activeCategory, setActiveCategory] = useState(data.menu[0].category);

    return (
        <div className="w-full max-w-6xl mx-auto pb-10 px-4">
            <div className="mt-10 mb-20">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center">Menus</h1>
                <p className="mt-5 leading-7 first:mt-0">
                    Our A La Carte menu showcases the best market seafood, constantly
                    changing to reflect availability and sustainability. A round-the-world
                    culinary tour, it will conjure up those memories of holidays you never wanted to end.
                </p>
                <p className="mt-5 leading-7 first:mt-0">
                    If you require our Allergen Guide, please ask your waiter. This is a fictional menu that uses.
                </p>
            </div>
            <div className="sticky top-0 z-50 mb-5 flex w-full backdrop-blur-sm bg-white/30 dark:bg-black/30 overflow-x-auto hide-scrollbar w-full justify-center">
                {data.menu.map(category =>
                    <button key={category.category}
                        onClick={() => setActiveCategory(category.category)}
                        className={`mx-4 md:mx-10 text-xl font-semibold whitespace-pre-line tracking-tight ${activeCategory === category.category ? 'underline' : ''}`}>
                        {category.category}
                    </button>
                )}
            </div>
            {data.menu.filter(category => category.category === activeCategory)
                .map(category => <Category category={category} key={category.category} />)}
        </div>
    );
}