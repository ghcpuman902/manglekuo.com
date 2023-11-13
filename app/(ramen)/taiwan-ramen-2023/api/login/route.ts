import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUser } from '../../utils/user'

export async function POST(request: NextRequest) {
  const reqData = await request.json();
  try {

  const oneMonthFromNow = Date.now() + 30* 24 * 60 * 60 * 1000
    const email = reqData.email;
    cookies().set({
      name: 'email',
      value: email,
      secure: true,
      httpOnly: true,
      sameSite: true,
      expires: oneMonthFromNow
    })

    const name = reqData.name;
    cookies().set({
      name: 'name',
      value: name,
      secure: true,
      httpOnly: true,
      sameSite: true,
      expires: oneMonthFromNow
    })

    const picture = reqData.picture;
    cookies().set({
      name: 'picture',
      value: picture,
      secure: true,
      httpOnly: true,
      sameSite: true,
      expires: oneMonthFromNow
    })

    let userProfile = await getUser();
    return NextResponse.json(userProfile)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 })
  }
}