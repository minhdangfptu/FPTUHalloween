"use client";

import { useState } from "react";
import "./OldEvent.css";
import {
  Container,
  Box,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useNavigate } from "react-router-dom";

const eventsData = [
  {
    id: 1,
    title: "FPTU Halloween 2025",
    status: "Sắp diễn ra",
    statusColor: "success",
    date: "28/10 - 31/10/2025",
    // --- Bắt đầu chỉnh sửa ---
    description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟓]: 𝐖𝐈𝐒𝐇𝐁𝐎𝐔𝐍𝐃

😈 Mỗi đêm, vào ngày 31/10 hằng năm, giữa màn sương dày đặc, thị trấn ma quái 𝐖𝐢𝐬𝐡𝐛𝐨𝐮𝐧𝐝 xuất hiện rồi biến mất như chưa từng tồn tại…. Nhưng năm nay, sau hàng thế kỷ ẩn mình, cái tên bao năm ám ảnh thị trấn hóa ra chỉ là một mặt nạ khác của Joker - thực thể tàn nhẫn chỉ sống để đánh tráo điều ước, nuốt chửng linh hồn và biến hy vọng thành lời nguyền. Lúc ấy, ở nơi trung tâm thi trấn mới rõ hình Quán rượu cổ, nơi mọi điều ước đều có giá, mọi “quy tắc trò chơi” chỉ để dẫn dắt những ván đấu chết chóc do hắn bày ra.

👻 Người bước chân vào vùng đất này sẽ phải đặt cược chính linh hồn của mình: thắng sẽ chạm tới điều ước sâu thẳm nhất, còn thua sẽ bị phong ấn vĩnh viễn giữa bốn vùng đất tội lỗi: Cơ, Rô, Bích, Tép - nơi phản chiếu mặt tối của mỗi người.

🎃 Liệu bạn là người chiến thắng… hay là kẻ bị phong ấn?`,
    // --- Kết thúc chỉnh sửa ---
    image:
      "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/557548210_783742787847613_9207811038853147592_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeFUV1lHfyPBqIYOuYAUu1rBmyXqMbmOts-bJeoxuY62z6ItcD8p3wVOS3mNaMqtLoD86ucHQHtCoW3Mc2oGRwTn&_nc_ohc=eKZ5xU-KvCQQ7kNvwE4yYmp&_nc_oc=Adl9LDtaf5x_cOvY2HHyHCCw1goUqaBNmKnP3x1P68aTEu9la7dos4wqE22CVvoqBOg&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=sMLkjPtp_Y4wWSYwTQpWrg&oh=00_Afd1rgL90qAc7j_CJZ37h8a4C-4pbY87QmebqYfZ8c1VUQ&oe=68F4FF4D",
  },
  {
    id: 2,
    title: "FPTU Halloween 2024",
    status: "Đã kết thúc",
    statusColor: "error",
    date: "29/10 - 31/10/2024",
    description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟒]: U LINH KÝ - ÂM DƯƠNG TỬ KHÍ

👻 Vào ngày lễ 𝐇𝐚𝐥𝐥𝐨𝐰𝐞𝐞𝐧 tại ngôi làng Hola, một quyển sách cổ tên “U linh Ký” vô tình được phát hiện dẫn đến các linh hồn của dân làng bị hút vào một thế giới huyền bí chứa đầy ma quỷ Việt Nam. Trong cõi linh hồn này, dân làng phải đối mặt với hình ảnh thảm thiết của Ma Da, tiếng khóc lóc ỉ ôi của Ma Đói, hồn Ma Lai lang thang dưới bóng đêm, những tiếng cười rùng rợn của Ông Ba Bị và tiếng Ma Trơi văng vẳng bên tai. Những con ma luôn tìm cách đánh cắp ký ức của họ, khiến dân làng dần mất nhận thức và trở thành con mồi cho những ma quỷ âm dương. 
💀 Nhưng hồn ma không để ý rằng trong số người dân đã bị cuốn vào, có một người tên Kiến Văn, mang trong mình một tấm bùa hộ mệnh được tổ tiên truyền lại. Nhờ vào tấm bùa đó, Kiến Văn đã thoát khỏi sự mê hoặc của quỷ dữ trước khi ký ức cuối cùng bị đánh mất. Cùng lúc ấy, Kiến Văn nhận ra rằng các loài ma luôn cố gắng đánh cắp đi ký ức của dân làng, và đây chính là chìa khóa để thoát khỏi cõi U Linh man rợ, Kiến Văn quyết định nói cho dân làng phát hiện của mình và tìm cách để lấy lại những mảnh ký ức đã mất. 
👿 Nhưng không phải ai cũng đủ tỉnh táo, can đảm và mạnh mẽ để thoát khỏi cõi U linh huyền bí này, liệu rằng những con người vô tội kia có thể vượt qua thử thách gian nan để quay trở về với trần gian?`,
    image:
      "https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/483800792_624546830433877_4457845983010099236_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeG2-KQ9lknJGqJ9ZWzMKPzle2oQLQ__Yft7ahAtD_9h--of5zYWQDSSPtl117aUcYqNtRnzEnP6RSsRFlhCzGZA&_nc_ohc=86VDQM0OA1cQ7kNvwEBInNu&_nc_oc=Adl_uY9L1RsMmjT7x6uxta-9ye1d4qX2JOdvN7q6iK4rkFw3ynYEXY1purD6uNYp6JU&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=dx2Kvip5gPFCE8k8DxU2Yw&oh=00_AfeUSri-C8cIT7XYJMYs5ybSQzM0UWwEyFrsUU-tjlj3UQ&oe=68F4FC44",
  },
  {
    id: 3,
    title: "FPTU Halloween 2023",
    status: "Đã kết thúc",
    statusColor: "error",
    date: "30/10 - 31/10/2023",
    description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟑]: 𝐇𝐀𝐔𝐍𝐓𝐄𝐃 𝐅𝐄𝐒𝐓

😈 Vào ngày 31/10 hằng năm, phố Fear chứng kiến sự trỗi dậy của rất nhiều thế lực tà ác vượt ra từ cánh cửa địa ngục, gây náo loạn cuộc sống của người dân nơi đây. Sau sự ra đi của con quỷ Kurbis, chúa tể địa ngục là Lucifear lên ngôi và bắt đầu tuyên bố sự thống trị của mình.

👹 Để gia tăng sức mạnh của mình, Lucifear đã cử hắc miêu (Phasma) - cánh tay phải đắc lực của hắn ta xuống nhân gian và đánh cắp rất nhiều linh hồn của con người. Những linh hồn đó không chỉ gia tăng thêm sức mạnh cho Lucifear mà còn là phần thưởng cho rất nhiều con quỷ đang khao khát thống trị loài người.

👻 Để cứu được những linh hồn vô tội kia, tương truyền rằng có một cây cầu vàng (Spirit Bridge) là cây cầu kết nối giữa hai thế giới tâm linh này. Ngày mà thế giới âm dương hòa vào làm một, người thân của họ phải cải trang thành những ác linh và vượt qua ranh giới của loài người, thông qua con đường vàng và đi giải cứu những linh hồn kia. Họ bắt buộc phải tham gia vào buổi tiệc “Đám cưới ma” - một đám cưới quỷ dị của chúa tể tàn ác Lucifear, nơi hội tụ rất nhiều thế lực hắc ám và các hồn ma đen tối. Muốn vượt qua bữa tiệc kì bí này, con người không những ăn uống, nhảy múa, ca hát mà còn phải tham gia vào các trò chơi rùng rợn nơi đây. Mang trong mình linh hồn thuần khiết và dũng cảm, liệu con người có vượt qua được nỗi sợ hãi, cứu sống những linh hồn oan uổng hay trở thành món ăn tráng miệng dành cho chúa tể quỷ dữ Lucifear?`,

    image:
      "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/387759817_290264400528790_6818600665982154478_n.png?stp=dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHl4s3-dYQpK6J_dTl5u8d5mSBRNUmCwwyZIFE1SYLDDHHipMECBSBW7u9yZblFmDzc-ZS6Sza5J4_aZg87mZiS&_nc_ohc=sJ8XuzjKJp0Q7kNvwHsizPM&_nc_oc=AdnosQNVxt1bgL-LWS0OpG-T4pQm2pF8uFxISLMtV0iVbJh2e0Uq3b_HOehsyhNSznM&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=knzEvM5nU2CyymdvnntNOw&oh=00_Afe9Gc87S8381Eh7Im9kqmJayyDH099sIZhSn0xB7c_oag&oe=68F4F6BF",
  },
  {
    id: 4,
    title: "FPTU Halloween 2022",
    status: "Đã kết thúc",
    statusColor: "error",
    date: "31/10/2022",
    description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟐]: 𝐅𝐄𝐀𝐑 𝐂𝐎𝐑𝐍𝐄𝐑

👻 KHÁM PHÁ VÙNG ĐẤT KỲ BÍ - PHỐ FEAR NGAY GIỮA LÒNG FPTU👻

🧙‍♀️ Không còn là những đồn đoán, sự kiện Halloween duy nhất trong năm 2022 - 𝐅𝐞𝐚𝐫 𝐂𝐨𝐫𝐧𝐞𝐫 sẽ chính thức “lên nòng” vào ngày 31/10 - thứ 2 tới đây tại sân trước toà nhà Delta.

Trong buổi tối 31/10 tới đây, BTC sẽ đưa bạn đến với Fear Corner - Khu phố Halloween: Một khu phố đặc biệt, nơi những “linh hồn” có thể trở về trần gian và sống như những người bình thường. Tuy nhiên, đây sẽ là nơi giao giữa âm dương, nên không khí tràn ngập sự ghê rợn, với những cây quỷ, những bóng ma và bộ xương khô đến rợn người.

👻 Đây sẽ là cơ hội để các con dân FPTU thỏa sức bước vào 1 vùng đất vô cùng xa lạ, và khám phá vô vàn những bí ẩn tại đây với các hoạt động:

🎃 Cùng hóa trang để không bị những người âm đánh cắp mất linh hồn.
🎃 Ghé thăm những ngóc ngách, trải nghiệm các gian hàng tại Phố Fear.
🎃 Lần đầu trà trộn và check in ngay giữa lòng thế giới cõi âm.
🎃 Tham gia hoạt động Trick or Treat.
🎃 Thưởng thức các tiết mục văn nghệ sôi động trong 1 bầu không gian vô cùng đặc biệt… và vân vân những đặc quyền khác.

👻 Sự góp mặt của các bạn tại Phố Fear chắc chắn sẽ đem tới một mùa Halloween vô cùng đáng nhớ tại trường Ép! Còn không mau chuẩn bị một bộ trang phục ấn tượng và sẵn sàng “lên dây cót” cùng BTC để nhận lấy tấm vé đến Vùng đất huyền bí nào các bạn ơi! 🤩`,
    image:
      "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/312648132_121214774100421_8068566281214762802_n.png?stp=dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFN9xRwnpMsT8IdhfZFyAQajI_fgtALO1yMj9-C0As7XJYuiCJ2YtMepMs3gM7n3MIrSeX7sc3f_GU1rlQizl3r&_nc_ohc=uRRMFB_ngx8Q7kNvwFbnFo3&_nc_oc=Adn7Cp-iT8DXBbpoD3ilHsPR1yZjyaR22uFJcsVzMue-LWJOIqpQ9FNxNLvuZXNsIzA&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=IcLLsRBmYmrz1NWL0YXdZw&oh=00_Affm3LljAbIhOPIzFIeua5koOY6AEhb2KtNyZhrchj0xhQ&oe=68F4DC65",
  },
  {
    id: 5,
    title: "FPTU Halloween 2020",
    // Sai thông tin trạng thái, hôm nay là 2025
    status: "Đã kết thúc",
    statusColor: "error",
    date: "30/10 - 31/10/2020",
    description: `[𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟎]: 𝐓𝐇𝐄 𝐇𝐀𝐔𝐍𝐓𝐄𝐃 𝐅𝐎𝐑𝐄𝐒𝐓

💥🎃  ̼B̼O̼M̼ ̼T̼Ấ̼N̼ ̼H̼A̼L̼L̼O̼W̼E̼E̼N̼ ̼2̼0̼2̼0̼  🎃💥

🕸️ 𝐺𝑢̛𝑜̛𝑛𝑔 𝑘𝑖𝑎 𝑛𝑔𝑢̛̣ 𝑜̛̉ 𝑡𝑟𝑒̂𝑛 𝑡𝑢̛𝑜̛̀𝑛𝑔 
𝑁𝑔ℎ𝑒 𝑛𝑜́𝑖 𝑡𝑟𝑢̛𝑜̛̀𝑛𝑔 𝐹 𝑐𝑜́ 𝑔𝑖̀ ℎ𝑎𝑦 ℎ𝑜 
🕸️  𝐾𝑖̀ 𝑏𝑖́, 𝑚𝑎 𝑚𝑖̣, 𝑛ℎ𝑖𝑒̂̀𝑢 𝑡𝑟𝑜̀ 
𝐿𝑎̂̀𝑛 đ𝑎̂̀𝑢 𝑥𝑢𝑎̂́𝑡 ℎ𝑖𝑒̣̂𝑛, 𝑛𝑔𝑢̛𝑜̛̀𝑖 𝑛𝑔𝑢̛𝑜̛̀𝑖 đ𝑒̂̀𝑢 𝑚𝑜𝑛𝑔  

Nghe nói từ xưa đến nay, mảnh đất xa xôi nội thành này vẫn luôn chứa đựng nhiều bí ẩn, với những câu chuyện kinh dị có thật, các hiện tượng lạ được lan truyền gieo rắc nỗi sợ hãi cho thần dân nơi đây 😰. Nhưng giờ bạn sẽ không chỉ được nghe, mà còn được trải nghiệm nỗi sợ hãi một cách chân thật nhất và thử thách lòng can đảm với sự kiện kinh dị đậm chất FPTU lần này. 

🦇 Lễ hội “𝐇▲𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝟐𝟎𝟐𝟎” lần đầu tiên xuất hiện tại trường F với chủ đề “The Haunted Forest” hứa hẹn sẽ mang tới những trải nghiệm cực kì thú vị. Đây là dịp để các bạn được tham gia rất nhiều trò chơi đa dạng, thoả sức cosplay, hoá trang, khám phá bí ẩn ngôi nhà ma và giải mã những câu chuyện kinh hoàng!!!

👻 Còn rất nhiều bí mật đang chờ được khám phá, hãy chuẩn bị cho mình một bộ đồ hóa trang thật lộng lẫy và nhanh tay đặt vé để tham gia ngay nào!.`,
    image:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.6435-9/122703558_211287113687074_6599718321829311704_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHYJanfAqo4i6Yct_8FLhUq6zOfo-_8h9DrM5-j7_yH0Jz30o2wGg7DLr2iQ5JO_CMG03IvIwh39FISRwEQT4x6&_nc_ohc=KLcf0dODldQQ7kNvwFC0zs2&_nc_oc=AdkuZcF-mJxc-J3MQ_WbTp6qxLZzmrQPzcFHP_4i6V4XQIC2t-HEYdkY_6ZoCQptF_g&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=_HNWI0PVHzCoRzcJn0MQSQ&oh=00_AfcQHDg-xKIP_Onmei8EBEiJrW4LRuCSBueg5cnBUQBSPg&oe=6915927C",
  },
];

export default function OldEvent() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const filteredEvents = eventsData.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            CÁC MÙA SỰ KIỆN FPTU HALLOWEEN
          </h1>
        </div>
      </header>
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Search Bar */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <TextField
              padding="10px"
              size="small"
              fullWidth
              placeholder="Tìm kiếm sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 600,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#E63946",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#E63946",
                  },
                },
              }}
            />
          </Box>

          {/* Events Section */}
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                width: "100%",
              }}
            >
              {filteredEvents.map((event) => (
                <Card
                  key={event.id} // Thêm key prop để React hoạt động hiệu quả
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    bgcolor: "white",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt={event.title}
                    sx={{
                      bgcolor: "#e0e0e0",
                      borderRadius: "12px 12px 0 0",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: "#333",
                        fontSize: "1.1rem",
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={event.status}
                        color={event.statusColor}
                        size="small"
                        sx={{
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                          borderRadius: 2,
                        }}
                      />
                      <Chip
                        label={event.date}
                        size="small"
                        sx={{
                          bgcolor: "#f0f0f0",
                          color: "#666",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          height: 24,
                          borderRadius: 2,
                        }}
                      />
                    </Box>

                    {/* --- Bắt đầu chỉnh sửa quan trọng --- */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                        // Thêm thuộc tính này để hiển thị xuống dòng
                        whiteSpace: "pre-line",
                      }}
                    >
                      {event.description}
                    </Typography>
                    {/* --- Kết thúc chỉnh sửa quan trọng --- */}
                  </CardContent>
                </Card>
              ))}
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Button
                  onClick={() => {
                    navigate ("/fanpage");
                  }}
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#E63946",
                    color: "white",
                    backgroundColor: "#E63946",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderWidth: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#E63946",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(230, 57, 70, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Fanpage Sự kiện
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
