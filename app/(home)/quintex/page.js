export default async function Page() {

    return (
        <div class="bg-black text-white">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <div class="bg-gray-700 p-2 rounded-full"></div>
                        <span class="ml-2 text-sm hidden md:block">Greatwell (Huai'an) Co., Ltd.</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <a href="#" class="text-gray-300 hover:text-white text-sm">Search</a>
                        <a href="#" class="text-gray-300 hover:text-white text-sm">MENU</a>
                        <div class="flex space-x-1">
                            <a href="#" class="text-gray-300 hover:text-white text-xs md:text-sm">EN</a>
                            <span class="hidden md:inline">/</span>
                            <a href="#" class="text-gray-300 hover:text-white text-xs md:text-sm">DE</a>
                            <span class="hidden md:inline">/</span>
                            <a href="#" class="text-gray-300 hover:text-white text-xs md:text-sm">中文</a>
                        </div>
                    </div>
                </div>

                <div class="text-center md:text-left mt-8">
                    <h1 class="text-2xl md:text-5xl font-bold">Transforming Molten Rocks into Powerful Solutions</h1>
                    <p class="text-xs md:text-sm text-gray-400 mt-4">Investment Casting Solution Provider</p>
                </div>

                <div class="flex flex-col md:flex-row justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4 mt-8">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">Learn more</button>
                    <button class="border border-blue-500 text-blue-500 px-4 py-2 rounded-md text-sm">or contact us</button>
                </div>
            </div>
        </div>
    );
}